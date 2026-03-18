import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, ImagePlus, X, CheckCircle2, Home, Building2, MapPin, Key, ArrowLeft, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = "venda_casa" | "apartamento" | "terreno" | "aluguel" | null;

const categories = [
  { id: "venda_casa" as Category, label: "Vender Casa", icon: Home, status: "venda", type: "casa" },
  { id: "apartamento" as Category, label: "Apartamento", icon: Building2, status: "venda", type: "apartamento" },
  { id: "terreno" as Category, label: "Terreno", icon: MapPin, status: "venda", type: "terreno" },
  { id: "aluguel" as Category, label: "Aluguel", icon: Key, status: "aluguel", type: "casa" },
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
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
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

    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      title: form.title,
      price: parseFloat(form.price) || 0,
      property_type: selectedCat.type,
      status: selectedCat.status,
      location: form.location,
      description: form.description,
      bedrooms: isTerrain ? 0 : parseInt(form.bedrooms) || 0,
      bathrooms: isTerrain ? 0 : parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      parking: isTerrain ? 0 : parseInt(form.parking) || 0,
      featured: form.featured,
      images: allImages,
    });

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">Adicionar Imóvel</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">Selecione o tipo de anúncio</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="bg-card rounded-xl p-6 shadow-soft text-left transition-all hover:shadow-md hover:ring-2 hover:ring-primary/40 group"
            >
              <cat.icon className="w-8 h-8 text-primary mb-3 transition-transform group-hover:scale-110" />
              <h3 className="font-display font-semibold text-foreground text-lg">{cat.label}</h3>
              <p className="text-muted-foreground text-sm font-body mt-1">
                {cat.id === "aluguel" ? "Imóvel para locação" : `${cat.label} à venda`}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setCategory(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{selectedCat?.label}</h1>
          <p className="text-muted-foreground text-sm font-body mt-0.5">Preencha as informações do imóvel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
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
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
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
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Imagem de Destaque</h2>
          {featuredImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden max-w-sm group">
              <img src={featuredImage} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full max-w-sm aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30">
              <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground font-body">{uploading ? "Enviando..." : "Selecionar imagem principal"}</span>
              <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Gallery */}
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
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
              <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30">
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
