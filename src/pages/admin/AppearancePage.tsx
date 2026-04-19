import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTestProfile } from "@/hooks/useTestProfile";
import { supabase } from "@/integrations/supabase/client";
import { demoModels } from "@/data/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Layout, Palette, Save, CheckCircle2, ExternalLink, Lock, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import previewAuroraPrime from "@/assets/preview-aurora-prime.png";
import previewSkylineUrban from "@/assets/preview-skyline-urban.png";
import previewMetropolitanElite from "@/assets/preview-metropolitan-elite.png";
import previewVillaCapital from "@/assets/preview-villa-capital.png";
import previewUrbanSignature from "@/assets/preview-urban-signature.png";
import previewInfinityCity from "@/assets/preview-infinity-city.png";
import previewEmpireUrban from "@/assets/preview-empire-urban.png";
import previewPrimeDistrict from "@/assets/preview-prime-district.png";
import previewCrownCity from "@/assets/preview-crown-city.png";

const previewMap: Record<string, string> = {
  "aurora-prime": previewAuroraPrime,
  "skyline-urban": previewSkylineUrban,
  "metropolitan-elite": previewMetropolitanElite,
  "villa-capital": previewVillaCapital,
  "urban-signature": previewUrbanSignature,
  "infinity-city": previewInfinityCity,
  "empire-urban": previewEmpireUrban,
  "prime-district": previewPrimeDistrict,
  "crown-city": previewCrownCity,
};

// Map model IDs to the theme IDs used in site_settings
const modelIdToThemeId: Record<string, string> = {
  "aurora-prime": "model1",
  "skyline-urban": "model2",
  "metropolitan-elite": "model3",
  "villa-capital": "model4",
  "urban-signature": "model5",
  "infinity-city": "model6",
  "empire-urban": "model7",
  "prime-district": "model8",
  "crown-city": "model9",
};

const themeIdToModelId: Record<string, string> = Object.fromEntries(
  Object.entries(modelIdToThemeId).map(([k, v]) => [v, k])
);

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

// Modelos liberados no plano free
const FREE_MODEL_IDS = new Set(["empire-urban", "prime-district"]);
// Cores liberadas no plano free
const FREE_COLOR_HEXES = new Set(["#1E3A8A", "#C9A646", "#B91C1C"]);

const AppearancePage = () => {
  const { user } = useAuth();
  const { isFree } = useTestProfile();
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

  const selectedModelId = themeIdToModelId[selectedTheme] || "aurora-prime";

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

        {/* Themes - matching landing page ModelsSection */}
        <TabsContent value="theme">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoModels.map((model, i) => {
              const themeId = modelIdToThemeId[model.id];
              const isSelected = selectedTheme === themeId;

              return (
                <motion.div
                  key={model.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 bg-card shadow-soft hover:shadow-lg cursor-pointer ${isSelected ? "ring-2 ring-primary border-primary/30" : "border-border hover:border-primary/30"}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => setSelectedTheme(themeId)}
                >
                  {/* Preview Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={previewMap[model.id]}
                      alt={`Preview do modelo ${model.name}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    {/* Large number */}
                    <span
                      className="absolute top-3 left-4 font-display font-black text-6xl leading-none select-none pointer-events-none text-white drop-shadow-lg"
                      style={{ opacity: 0.9 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-bold bg-primary text-primary-foreground shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Color bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${model.colors.primary}, ${model.colors.secondary})` }} />

                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-1.5 text-foreground">{model.name}</h3>
                    <p className="text-sm mb-3 font-body italic text-muted-foreground">"{model.tagline}"</p>

                    {/* Color palette */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 rounded-full border border-border shadow-sm" style={{ backgroundColor: model.colors.primary }} />
                      <span className="text-xs font-body text-muted-foreground ml-1">{model.style}</span>
                    </div>

                    <a
                      href={`/demo/${model.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all hover:brightness-110 w-full justify-center text-white"
                      style={{ backgroundColor: "#00bf63" }}
                    >
                      Ver Demonstração
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
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
