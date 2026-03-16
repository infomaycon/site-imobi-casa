import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { demoModels, properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle, Award, TrendingUp, Users } from "lucide-react";
import brokerPhoto from "@/assets/broker-photo.jpg";
import { getSearchFilter } from "@/components/demo/SearchFilters";
import DemoSiteModel1 from "@/components/demo/DemoSiteModel1";
import DemoSiteModel2 from "@/components/demo/DemoSiteModel2";
import DemoSiteModel3 from "@/components/demo/DemoSiteModel3";
import PropertyCardModel4 from "@/components/demo/PropertyCardModel4";
import PropertyCardModel5 from "@/components/demo/PropertyCardModel5";
import PropertyCardModel6 from "@/components/demo/PropertyCardModel6";
import PropertyGalleryModel4 from "@/components/demo/PropertyGalleryModel4";
import PropertyGalleryModel5 from "@/components/demo/PropertyGalleryModel5";
import PropertyGalleryModel6 from "@/components/demo/PropertyGalleryModel6";
import ImageLightbox from "@/components/demo/ImageLightbox";
import ModelLogo from "@/components/demo/ModelLogo";
import ModelFooter from "@/components/demo/ModelFooter";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import bannerModel4 from "@/assets/banner-model4.jpg";
import bannerModel5 from "@/assets/banner-model5.jpg";
import bannerModel6 from "@/assets/banner-model6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

type DemoPage = "home" | "listing" | "property" | "about" | "contact" | "gallery";

const DemoSite = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const model = demoModels.find((m) => m.id === modelId);

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-heading">Modelo não encontrado.</p>
      </div>
    );
  }

  // Route first 3 models to their unique templates
  if (model.id === "aurora-prime") return <DemoSiteModel1 model={model} />;
  if (model.id === "skyline-urban") return <DemoSiteModel2 model={model} />;
  if (model.id === "metropolitan-elite") return <DemoSiteModel3 model={model} />;

  // Generic template for models 4-9
  return <GenericDemoSite model={model} />;
};

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const buildContactMessage = (form: ContactFormState, modelName: string) => {
  const intro = `Olá! Tenho interesse em um imóvel da ${modelName}.`;
  const details = [
    form.name ? `Nome: ${form.name}` : null,
    form.email ? `E-mail: ${form.email}` : null,
    form.phone ? `Telefone: ${form.phone}` : null,
    form.message ? `Mensagem: ${form.message}` : null,
  ].filter(Boolean);

  return [intro, ...details].join("\n");
};

const buildEmailHref = (form: ContactFormState, model: DemoModel) => {
  const subject = encodeURIComponent(`Contato - ${model.name}`);
  const body = encodeURIComponent(buildContactMessage(form, model.name));
  return `mailto:contato@${model.id}.com.br?subject=${subject}&body=${body}`;
};

const buildWhatsAppHref = (form: ContactFormState, model: DemoModel) => {
  const text = encodeURIComponent(buildContactMessage(form, model.name));
  return `https://wa.me/5511999990000?text=${text}`;
};

const BrokerSection = ({ colors, model }: { colors: DemoModel["colors"]; model: DemoModel }) => (
  <section id="about-section" className="py-24">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: colors.primary }}>Sobre o Corretor</h2>
        <p className="font-body" style={{ color: colors.text + "77" }}>
          Conheça o profissional por trás de cada negociação e o atendimento consultivo da {model.name}.
        </p>
      </div>
      <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-0 rounded-[2rem]" style={{ background: `linear-gradient(145deg, ${colors.primary}22, ${colors.secondary}18)` }} />
            <img
              src={brokerPhoto}
              alt="Ricardo Mendes - Corretor de imóveis"
              className="relative w-full h-[430px] rounded-[2rem] object-cover shadow-xl"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-display font-semibold uppercase tracking-[0.25em]" style={{ color: colors.primary }}>Atendimento consultivo</p>
            <h3 className="font-display font-bold text-2xl md:text-3xl" style={{ color: colors.text }}>Ricardo Mendes</h3>
            <p className="font-body text-sm font-semibold" style={{ color: colors.text + "88" }}>CRECI 123.456-F · Especialista em imóveis de alto padrão</p>
          </div>

          <p className="text-base leading-relaxed font-body" style={{ color: colors.text + "aa" }}>
            Com mais de <strong style={{ color: colors.text }}>15 anos de experiência</strong> no mercado imobiliário, Ricardo atua com visão estratégica, curadoria criteriosa e acompanhamento próximo em cada etapa da compra ou venda.
          </p>
          <p className="text-base leading-relaxed font-body" style={{ color: colors.text + "aa" }}>
            Na <strong style={{ color: colors.primary }}>{model.name}</strong>, o foco está em construir relações de confiança e entregar segurança, discrição e performance para clientes que buscam os melhores endereços da cidade.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { icon: Award, label: "Experiência", value: "15+ anos" },
              { icon: TrendingUp, label: "Negócios fechados", value: "500+" },
              { icon: Users, label: "Clientes atendidos", value: "1.200+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border p-5 text-center"
                style={{ borderColor: colors.text + "12", backgroundColor: colors.text + "03" }}
              >
                <stat.icon className="w-5 h-5 mx-auto mb-3" style={{ color: colors.primary }} />
                <p className="font-display font-bold text-lg" style={{ color: colors.text }}>{stat.value}</p>
                <p className="text-xs font-body" style={{ color: colors.text + "66" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = ({
  colors,
  model,
  form,
  onFieldChange,
}: {
  colors: DemoModel["colors"];
  model: DemoModel;
  form: ContactFormState;
  onFieldChange: (field: keyof ContactFormState, value: string) => void;
}) => (
  <section id="contact-section" className="py-24">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: colors.primary }}>Entre em Contato</h2>
        <p className="font-body mb-10 max-w-2xl mx-auto" style={{ color: colors.text + "77" }}>
          Tem interesse em algum imóvel? Envie sua mensagem por e-mail ou WhatsApp.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-[2rem] border p-6 md:p-8" style={{ borderColor: colors.text + "12", backgroundColor: colors.text + "03" }}>
        <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-display font-semibold mb-2 text-center sm:text-left" style={{ color: colors.text }}>Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 rounded-xl border text-sm font-body outline-none transition-all focus:ring-2"
              style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text, '--tw-ring-color': colors.primary + "40" } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-display font-semibold mb-2 text-center sm:text-left" style={{ color: colors.text }}>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border text-sm font-body outline-none transition-all focus:ring-2"
              style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text, '--tw-ring-color': colors.primary + "40" } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-display font-semibold mb-2 text-center sm:text-left" style={{ color: colors.text }}>Telefone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 rounded-xl border text-sm font-body outline-none transition-all focus:ring-2"
              style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text, '--tw-ring-color': colors.primary + "40" } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-display font-semibold mb-2 text-center sm:text-left" style={{ color: colors.text }}>Mensagem</label>
            <textarea
              value={form.message}
              onChange={(e) => onFieldChange("message", e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none outline-none transition-all focus:ring-2"
              style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text, '--tw-ring-color': colors.primary + "40" } as React.CSSProperties}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <a
              href={buildEmailHref(form, model)}
              className="inline-flex flex-1 items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              <Mail className="w-5 h-5" /> Enviar por e-mail
            </a>
            <a
              href={buildWhatsAppHref(form, model)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" /> Enviar no WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  </section>
);

const GenericDemoSite = ({ model }: { model: DemoModel }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormState>({ name: "", email: "", phone: "", message: "" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isModel4 = model.id === "villa-capital";
  const isModel5 = model.id === "urban-signature";
  const isModel6 = model.id === "infinity-city";
  const useCustomCards = isModel4 || isModel5 || isModel6;

  const c = model.colors;

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (selectedProperty) window.scrollTo(0, 0); }, [selectedProperty]);

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

  const updateContactField = (field: keyof ContactFormState, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const navigateWithinDemo = (target: DemoPage, sectionId?: string) => {
    setPage(target);
    setMobileMenu(false);
    setSelectedProperty(null);

    if (sectionId) {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NavLink = ({ label, target, sectionId }: { label: string; target: DemoPage; sectionId?: string }) => (
    <button
      onClick={() => navigateWithinDemo(target, sectionId)}
      className="text-sm font-medium transition-colors hover:opacity-80"
      style={{ color: page === target && !sectionId ? c.primary : c.text + "88" }}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <div className="fixed top-4 left-4 z-[60]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-display font-semibold bg-primary text-primary-foreground shadow-lg hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-3 h-3" /> Voltar
        </button>
      </div>

      <nav className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: c.bg + "ee", borderColor: c.text + "12" }}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigateWithinDemo("home")}>
            <ModelLogo model={model} />
          </button>
          <div className="hidden md:flex items-center gap-6">
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Galeria" target="gallery" />
            <NavLink label="Sobre" target="home" sectionId="about-section" />
            <NavLink label="Contato" target="home" sectionId="contact-section" />
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: c.text }}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden p-6 space-y-4 border-t" style={{ borderColor: c.text + "12" }}>
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Galeria" target="gallery" />
            <NavLink label="Sobre" target="home" sectionId="about-section" />
            <NavLink label="Contato" target="home" sectionId="contact-section" />
          </div>
        )}
      </nav>

      {page === "home" && !selectedProperty && (
        <>
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <img src={isModel4 ? bannerModel4 : isModel5 ? bannerModel5 : isModel6 ? bannerModel6 : propertyImages[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <motion.h1 className="font-display font-black text-4xl md:text-6xl mb-4 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {model.name}
              </motion.h1>
              <motion.p className="text-lg md:text-xl italic mb-8 text-white/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                "{model.tagline}"
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={() => navigateWithinDemo("listing")} className="px-8 py-3 rounded-lg font-display font-bold transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Ver Imóveis
                </button>
                <button onClick={() => navigateWithinDemo("home", "contact-section")} className="px-8 py-3 rounded-lg font-display font-semibold border-2 transition-all" style={{ borderColor: "#ffffff40", color: "#fff" }}>
                  Fale Conosco
                </button>
              </motion.div>
            </div>
          </section>

          {(() => {
            const FilterComponent = getSearchFilter(model.id);
            return FilterComponent ? <FilterComponent colors={c} /> : null;
          })()}

          <section id="listing-section" className="py-16">
            <div className={`container mx-auto px-6 ${useCustomCards ? 'max-w-7xl' : 'max-w-6xl'}`}>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-8" style={{ color: c.text }}>Encontre seu Imóvel Ideal</h2>
              <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-5 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all"
                    style={{ backgroundColor: filter === f ? c.primary : c.text + "08", color: filter === f ? "#fff" : c.text + "88" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${useCustomCards ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                {filtered.slice(0, visibleCount).map((p) =>
                  isModel4 ? <PropertyCardModel4 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                  : isModel5 ? <PropertyCardModel5 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                  : isModel6 ? <PropertyCardModel6 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                  : <PropertyCard key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                )}
              </div>
              {filtered.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <button onClick={() => setVisibleCount((v) => v + 8)} className="px-6 py-2.5 rounded-lg text-sm font-display font-semibold transition-all border hover:opacity-80" style={{ borderColor: c.primary + "40", color: c.primary, backgroundColor: "transparent" }}>Ver mais imóveis</button>
                </div>
              )}
            </div>
          </section>

          <BrokerSection colors={c} model={model} />
          <ContactSection colors={c} model={model} form={contactForm} onFieldChange={updateContactField} />
        </>
      )}

      {page === "listing" && !selectedProperty && (
        <section className="py-16">
          <div className={`container mx-auto px-6 ${useCustomCards ? 'max-w-7xl' : 'max-w-6xl'}`}>
            <h2 className="font-display font-bold text-3xl text-center mb-4" style={{ color: c.text }}>Nossos Imóveis</h2>
            <p className="text-center mb-8" style={{ color: c.text + "77" }}>Explore nosso portfólio exclusivo de imóveis de alto padrão</p>
            {(() => {
              const FilterComponent = getSearchFilter(model.id);
              return FilterComponent ? <div className="mb-8"><FilterComponent colors={c} /></div> : null;
            })()}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-5 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all"
                  style={{ backgroundColor: filter === f ? c.primary : c.text + "08", color: filter === f ? "#fff" : c.text + "88" }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${useCustomCards ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
              {filtered.slice(0, visibleCount).map((p) =>
                isModel4 ? <PropertyCardModel4 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                : isModel5 ? <PropertyCardModel5 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                : isModel6 ? <PropertyCardModel6 key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                : <PropertyCard key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              )}
            </div>
            {filtered.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setVisibleCount((v) => v + 8)} className="px-6 py-2.5 rounded-lg text-sm font-display font-semibold transition-all border hover:opacity-80" style={{ borderColor: c.primary + "40", color: c.primary, backgroundColor: "transparent" }}>Ver mais imóveis</button>
              </div>
            )}
          </div>
        </section>
      )}

      {page === "gallery" && !selectedProperty && (
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-display font-bold text-3xl text-center mb-4" style={{ color: c.text }}>Galeria de Imóveis</h2>
            <p className="text-center mb-10" style={{ color: c.text + "77" }}>Explore as imagens do nosso portfólio</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {propertyImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
                  style={{ boxShadow: `0 2px 8px ${c.text}08` }}
                  whileHover={{ y: -3, boxShadow: `0 8px 24px ${c.text}15` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLightboxIndex(i)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <img src={img} alt={`Imóvel ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedProperty && (
        isModel4 ? <PropertyGalleryModel4 property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
        : isModel5 ? <PropertyGalleryModel5 property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
        : isModel6 ? <PropertyGalleryModel6 property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
        : <PropertyDetail property={selectedProperty} colors={c} featureIcon={featureIcon} onBack={() => setSelectedProperty(null)} />
      )}

      {page === "about" && !selectedProperty && <BrokerSection colors={c} model={model} />}
      {page === "contact" && !selectedProperty && <ContactSection colors={c} model={model} form={contactForm} onFieldChange={updateContactField} />}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={propertyImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>


      <ModelFooter model={model} onNavigate={(target, sectionId) => navigateWithinDemo(target as DemoPage, sectionId)} />
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
