import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Layout, Palette, Save, CheckCircle2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import previewModel1 from "@/assets/preview-aurora-prime.jpg";
import previewModel2 from "@/assets/preview-skyline-urban.jpg";
import previewModel3 from "@/assets/preview-metropolitan-elite.jpg";
import previewModel4 from "@/assets/preview-villa-capital.jpg";
import previewModel5 from "@/assets/preview-urban-signature.jpg";
import previewModel6 from "@/assets/preview-infinity-city.jpg";
import previewModel7 from "@/assets/preview-empire-urban.jpg";
import previewModel8 from "@/assets/preview-prime-district.jpg";
import previewModel9 from "@/assets/preview-crown-city.jpg";

const themes = [
  { id: "model1", name: "Modelo 1", desc: "Clean e moderno", preview: previewModel1 },
  { id: "model2", name: "Modelo 2", desc: "Elegante e minimalista", preview: previewModel2 },
  { id: "model3", name: "Modelo 3", desc: "Profissional premium", preview: previewModel3 },
  { id: "model4", name: "Modelo 4", desc: "Fullscreen imersivo", preview: previewModel4 },
  { id: "model5", name: "Modelo 5", desc: "Cinematográfico", preview: previewModel5 },
  { id: "model6", name: "Modelo 6", desc: "Grid moderno", preview: previewModel6 },
  { id: "model7", name: "Modelo 7", desc: "Clean expandido", preview: previewModel7 },
  { id: "model8", name: "Modelo 8", desc: "Glass luxo", preview: previewModel8 },
  { id: "model9", name: "Modelo 9", desc: "Flutuante moderno", preview: previewModel9 },
];

const accentColors = [
  { hex: "#1E3A8A", name: "Azul Marinho" },
  { hex: "#166534", name: "Verde Floresta" },
  { hex: "#C9A646", name: "Dourado" },
  { hex: "#111827", name: "Preto Grafite" },
  { hex: "#B91C1C", name: "Vermelho Escuro" },
  { hex: "#0F766E", name: "Teal" },
  { hex: "#9333EA", name: "Roxo" },
  { hex: "#EA580C", name: "Laranja" },
  { hex: "#0284C7", name: "Azul Céu" },
  { hex: "#4F46E5", name: "Índigo" },
  { hex: "#047857", name: "Esmeralda" },
  { hex: "#7C2D12", name: "Marrom" },
  { hex: "#374151", name: "Cinza Escuro" },
  { hex: "#065F46", name: "Verde Escuro" },
  { hex: "#9A3412", name: "Terracota" },
  { hex: "#1D4ED8", name: "Azul Royal" },
  { hex: "#15803D", name: "Verde" },
  { hex: "#A16207", name: "Âmbar" },
  { hex: "#BE123C", name: "Rosa" },
  { hex: "#0EA5E9", name: "Azul Claro" },
];

const AppearancePage = () => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState("model1");
  const [selectedColor, setSelectedColor] = useState("#1E3A8A");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("site_settings").select("selected_theme, color_palette").single().then(({ data }) => {
      if (data) {
        if (data.selected_theme) setSelectedTheme(data.selected_theme);
        if (data.color_palette) setSelectedColor(data.color_palette);
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").single();
    const payload = { selected_theme: selectedTheme, color_palette: selectedColor };
    if (existing) {
      await supabase.from("site_settings").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ ...payload, user_id: user.id });
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Aparência do Site</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Personalize o visual do seu site</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="bg-card shadow-soft h-12 p-1">
          <TabsTrigger value="theme" className="h-10 px-4 font-body"><Layout className="w-4 h-4 mr-2" />Escolher Tema</TabsTrigger>
          <TabsTrigger value="colors" className="h-10 px-4 font-body"><Palette className="w-4 h-4 mr-2" />Cores</TabsTrigger>
        </TabsList>

        {/* Themes */}
        <TabsContent value="theme">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`bg-card rounded-xl overflow-hidden shadow-soft text-left transition-all hover:shadow-md ${selectedTheme === theme.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="w-full aspect-video overflow-hidden">
                  <img src={theme.preview} alt={theme.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground">{theme.name}</h3>
                  <p className="text-muted-foreground text-sm font-body">{theme.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    {selectedTheme === theme.id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-body">Ativo</span>
                    )}
                    <a href={`/demo/${theme.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline font-body flex items-center gap-1 ml-auto">
                      <ExternalLink className="w-3 h-3" />Ver demo
                    </a>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Button onClick={handleSave} disabled={saving} className="h-12 px-8 font-display font-semibold">
              <Save className="w-5 h-5 mr-2" />{saving ? "Salvando..." : "Salvar Tema"}
            </Button>
            <SaveFeedback saved={saved} />
          </div>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors">
          <div className="bg-card rounded-xl p-6 shadow-soft space-y-6">
            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-1">Cor de Destaque</h2>
              <p className="text-sm text-muted-foreground font-body">A cor escolhida será aplicada nos botões, destaques e elementos principais do seu site.</p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`group relative w-full aspect-square rounded-xl transition-all hover:scale-110 ${selectedColor === color.hex ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Live Preview */}
            <div className="border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Preview em Tempo Real</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2.5 rounded-lg text-white font-body text-sm font-medium transition-colors" style={{ backgroundColor: selectedColor }}>
                  Botão Principal
                </button>
                <button className="px-6 py-2.5 rounded-lg font-body text-sm font-medium border-2 transition-colors" style={{ borderColor: selectedColor, color: selectedColor }}>
                  Botão Secundário
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-body text-muted-foreground">Texto de destaque:</span>
                <span className="font-display font-semibold" style={{ color: selectedColor }}>R$ 850.000</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor }} />
                <span className="text-sm font-body text-foreground">Elemento ativo com a cor selecionada</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: selectedColor }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Button onClick={handleSave} disabled={saving} className="h-12 px-8 font-display font-semibold">
              <Save className="w-5 h-5 mr-2" />{saving ? "Salvando..." : "Salvar Cor"}
            </Button>
            <SaveFeedback saved={saved} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SaveFeedback = ({ saved }: { saved: boolean }) => (
  <AnimatePresence>
    {saved && (
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-primary font-body text-sm">
        <CheckCircle2 className="w-5 h-5" />Salvo com sucesso!
      </motion.div>
    )}
  </AnimatePresence>
);

export default AppearancePage;
