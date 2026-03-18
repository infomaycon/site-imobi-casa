import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, ImagePlus, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddProperty = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    property_type: "casa",
    status: "venda",
    location: "",
    description: "",
    bedrooms: "0",
    bathrooms: "0",
    area: "0",
    parking: "0",
    featured: false,
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    setUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(e.target.files)) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        newImages.push(data.publicUrl);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      title: form.title,
      price: parseFloat(form.price) || 0,
      property_type: form.property_type,
      status: form.status,
      location: form.location,
      description: form.description,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      parking: parseInt(form.parking) || 0,
      featured: form.featured,
      images,
    });

    if (!error) {
      setSaved(true);
      setForm({ title: "", price: "", property_type: "casa", status: "venda", location: "", description: "", bedrooms: "0", bathrooms: "0", area: "0", parking: "0", featured: false });
      setImages([]);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Adicionar Imóvel</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Preencha as informações do novo imóvel</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-foreground">Tipo</Label>
              <Select value={form.property_type} onValueChange={(v) => handleChange("property_type", v)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-foreground">Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Detalhes</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-foreground">Quartos</Label>
              <Input type="number" value={form.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} min="0" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-foreground">Banheiros</Label>
              <Input type="number" value={form.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} min="0" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-foreground">Área (m²)</Label>
              <Input type="number" value={form.area} onChange={(e) => handleChange("area", e.target.value)} min="0" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-foreground">Vagas</Label>
              <Input type="number" value={form.parking} onChange={(e) => handleChange("parking", e.target.value)} min="0" className="h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body text-foreground">Descrição</Label>
            <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Descreva o imóvel..." rows={4} />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.featured} onCheckedChange={(v) => handleChange("featured", v)} />
            <Label className="font-body text-foreground cursor-pointer">⭐ Destacar imóvel</Label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Imagens</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30">
              <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-body">
                {uploading ? "Enviando..." : "Adicionar"}
              </span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
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
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-primary font-body text-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                Imóvel salvo com sucesso!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
