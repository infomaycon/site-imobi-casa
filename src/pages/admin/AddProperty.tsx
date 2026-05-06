import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, ImagePlus, X, CheckCircle2, Home, Building2, MapPin, Key, ArrowLeft, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { convertToWebp } from "@/lib/imageToWebp";
import DashboardHeader from "@/components/admin/DashboardHeader";
import PerformanceSection from "@/components/admin/PerformanceSection";

type Category = "venda_casa" | "apartamento" | "terreno" | "aluguel" | null;

const categories = [
  {
    id: "venda_casa" as Category, label: "Vender Casa", icon: Home, status: "venda", type: "casa",
    subtitle: "Cadastre casas à venda com destaque profissional",
    accent: "from-primary/25 to-primary/0",
    iconBg: "bg-primary/15 text-primary",
    glow: "shadow-[0_0_40px_-12px_hsl(var(--primary)/0.45)]",
  },
  {
    id: "apartamento" as Category, label: "Apartamento", icon: Building2, status: "venda", type: "apartamento",
    subtitle: "Anuncie apartamentos com fotos e detalhes premium",
    accent: "from-blue-500/25 to-blue-500/0",
    iconBg: "bg-blue-500/15 text-blue-500",
    glow: "shadow-[0_0_40px_-12px_rgba(59,130,246,0.45)]",
  },
  {
    id: "terreno" as Category, label: "Terreno", icon: MapPin, status: "venda", type: "terreno",
    subtitle: "Publique lotes e terrenos com localização precisa",
    accent: "from-amber-500/25 to-amber-500/0",
    iconBg: "bg-amber-500/15 text-amber-500",
    glow: "shadow-[0_0_40px_-12px_rgba(245,158,11,0.45)]",
  },
  {
    id: "aluguel" as Category, label: "Aluguel", icon: Key, status: "aluguel", type: "casa",
    subtitle: "Alta demanda — anuncie e converta locatários rapidamente",
    accent: "from-accent/35 to-accent/5",
    iconBg: "bg-accent/20 text-accent",
    glow: "shadow-[0_0_50px_-10px_hsl(var(--accent)/0.55)]",
    highlight: true,
  },
];

const MAX_GALLERY_IMAGES = 15; // plano mais alto

const AddProperty = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<Category>(null);
  const [form, setForm] = useState({
    title: "", price: "", location: "", description: "",
    bedrooms: "0", bathrooms: "0", area: "0", parking: "0", featured: false,
  });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const selectedCat = categories.find((c) => c.id === category);
  const isTerrain = category === "terreno";

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const webpFile = await convertToWebp(file);
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    // TODO: upload to new backend storage
    return null;
  };

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const url = await uploadImage(e.target.files[0]);
    if (url) setFeaturedImage(url);
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    setUploading(true);
    const remaining = MAX_GALLERY_IMAGES - galleryImages.length;
    const files = Array.from(e.target.files).slice(0, remaining);
    const newImages: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) newImages.push(url);
    }
    setGalleryImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCat) return;
    setSaving(true);

    const allImages = featuredImage ? [featuredImage, ...galleryImages] : galleryImages;

    // TODO: save to new backend
    const error = null;

    if (!error) {
      setSaved(true);
      setForm({ title: "", price: "", location: "", description: "", bedrooms: "0", bathrooms: "0", area: "0", parking: "0", featured: false });
      setFeaturedImage(null);
      setGalleryImages([]);
      setCategory(null);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  // Category selection menu
  if (!category) {
    return (
      <div className="max-w-6xl mx-auto">
        <DashboardHeader onAddClick={() => {
          const el = document.getElementById("category-grid");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }} />

        <div id="category-grid" className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Adicionar Imóvel</h2>
            <p className="text-muted-foreground text-sm font-body mt-0.5">Selecione o tipo de anúncio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setCategory(cat.id)}
              className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:shadow-xl group glass-panel ${
                cat.highlight
                  ? `ring-1 ring-accent/40 hover:ring-accent/60 ${cat.glow}`
                  : `hover:ring-1 hover:ring-primary/30 ${cat.glow}`
              }`}
            >
              {/* Decorative gradient blob */}
              <div className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${cat.accent} blur-3xl opacity-80 group-hover:opacity-100 transition-opacity`} />
              {/* Shine on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {cat.highlight && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-display font-bold uppercase tracking-wider shadow-[0_0_20px_hsl(var(--accent)/0.6)]">
                  Alta demanda 🔥
                </span>
              )}

              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 ${cat.iconBg}`}>
                <cat.icon className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="relative font-display font-bold text-foreground text-lg">{cat.label}</h3>
              <p className="relative text-muted-foreground text-sm font-body mt-1.5 leading-relaxed">
                {cat.subtitle}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Engagement strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {[
            { icon: "💬", text: "Você recebeu novos leads esta semana — responda rápido para converter mais." },
            { icon: "📈", text: "Imóveis em destaque recebem até 3x mais visitas do que anúncios padrão." },
            { icon: "💡", text: "Dica: anúncios com mais de 5 fotos geram 70% mais contatos." },
          ].map((tip, i) => (
            <div key={i} className="rounded-2xl glass-panel p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">{tip.icon}</span>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <PerformanceSection />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setCategory(null)} className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{selectedCat?.label}</h1>
          <p className="text-muted-foreground text-sm font-body mt-0.5">Preencha as informações do imóvel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Informações Básicas</h2>
          <div className="space-y-2">
            <Label className="font-body text-foreground">Título do Imóvel</Label>
            <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Ex: Casa 3 quartos no centro" required className="h-11" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-foreground">Preço (R$)</Label>
              <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="350000" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-foreground">Localização</Label>
              <Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="Centro, São Paulo - SP" className="h-11" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Detalhes</h2>
          <div className={`grid gap-4 ${isTerrain ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
            {!isTerrain && (
              <>
                <div className="space-y-2">
                  <Label className="font-body text-foreground">Quartos</Label>
                  <Input type="number" value={form.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} min="0" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-foreground">Banheiros</Label>
                  <Input type="number" value={form.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} min="0" className="h-11" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label className="font-body text-foreground">Área (m²)</Label>
              <Input type="number" value={form.area} onChange={(e) => handleChange("area", e.target.value)} min="0" className="h-11" />
            </div>
            {!isTerrain && (
              <div className="space-y-2">
                <Label className="font-body text-foreground">Vagas</Label>
                <Input type="number" value={form.parking} onChange={(e) => handleChange("parking", e.target.value)} min="0" className="h-11" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="font-body text-foreground">Descrição</Label>
            <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Descreva o imóvel..." rows={4} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.featured} onCheckedChange={(v) => handleChange("featured", v)} />
            <Label className="font-body text-foreground cursor-pointer flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" /> Destacar imóvel
            </Label>
          </div>
        </div>

        {/* Featured Image */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Imagem de Destaque</h2>
          {featuredImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden max-w-sm group">
              <img src={featuredImage} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full max-w-sm aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-foreground/[0.02]">
              <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground font-body">{uploading ? "Enviando..." : "Selecionar imagem principal"}</span>
              <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Gallery */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground text-lg">Galeria</h2>
            <span className="text-xs text-muted-foreground font-body">{galleryImages.length}/{MAX_GALLERY_IMAGES} imagens</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {galleryImages.length < MAX_GALLERY_IMAGES && (
              <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-foreground/[0.02]">
                <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-body">{uploading ? "Enviando..." : "Adicionar"}</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="h-12 px-8 font-display font-semibold text-base">
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Salvando..." : "Salvar Imóvel"}
          </Button>
          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-primary font-body text-sm">
                <CheckCircle2 className="w-5 h-5" />Imóvel salvo com sucesso!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
