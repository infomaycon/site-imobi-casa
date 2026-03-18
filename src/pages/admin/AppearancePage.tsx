import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Layout, Paintbrush } from "lucide-react";

const themes = [
  { id: "model1", name: "Modelo 1", desc: "Clean e moderno" },
  { id: "model2", name: "Modelo 2", desc: "Elegante e minimalista" },
  { id: "model3", name: "Modelo 3", desc: "Profissional premium" },
  { id: "model4", name: "Modelo 4", desc: "Fullscreen imersivo" },
  { id: "model5", name: "Modelo 5", desc: "Cinematográfico" },
  { id: "model6", name: "Modelo 6", desc: "Grid moderno" },
  { id: "model7", name: "Modelo 7", desc: "Clean expandido" },
  { id: "model8", name: "Modelo 8", desc: "Glass luxo" },
  { id: "model9", name: "Modelo 9", desc: "Flutuante moderno" },
];

const palettes = [
  { id: "blue", name: "Azul Moderno", colors: ["#3b82f6", "#1e40af", "#dbeafe"] },
  { id: "green", name: "Verde Imobiliário", colors: ["#22c55e", "#15803d", "#dcfce7"] },
  { id: "black", name: "Preto Premium", colors: ["#1a1a1a", "#404040", "#e5e5e5"] },
  { id: "gray", name: "Cinza Elegante", colors: ["#6b7280", "#374151", "#f3f4f6"] },
  { id: "gold", name: "Dourado Luxo", colors: ["#d97706", "#92400e", "#fef3c7"] },
];

const AppearancePage = () => {
  const [selectedTheme, setSelectedTheme] = useState("model1");
  const [selectedPalette, setSelectedPalette] = useState("green");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Aparência do Site</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Personalize o visual do seu site</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="bg-card shadow-soft h-12 p-1">
          <TabsTrigger value="theme" className="h-10 px-4 font-body"><Layout className="w-4 h-4 mr-2" />Escolher Tema</TabsTrigger>
          <TabsTrigger value="build" className="h-10 px-4 font-body"><Paintbrush className="w-4 h-4 mr-2" />Montar Tema</TabsTrigger>
          <TabsTrigger value="colors" className="h-10 px-4 font-body"><Palette className="w-4 h-4 mr-2" />Cores</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`bg-card rounded-xl p-5 shadow-soft text-left transition-all hover:shadow-md ${
                  selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="w-full h-32 rounded-lg bg-muted mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs font-body">Preview</span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{theme.name}</h3>
                <p className="text-muted-foreground text-sm font-body">{theme.desc}</p>
                {selectedTheme === theme.id && (
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-body">Ativo</span>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="build">
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <p className="text-muted-foreground font-body text-center py-8">
              Em breve: monte seu tema personalizado escolhendo cards, galerias e transições.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => setSelectedPalette(palette.id)}
                className={`bg-card rounded-xl p-5 shadow-soft text-left transition-all hover:shadow-md ${
                  selectedPalette === palette.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex gap-2 mb-3">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <h3 className="font-display font-semibold text-foreground">{palette.name}</h3>
                {selectedPalette === palette.id && (
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-body">Ativo</span>
                )}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppearancePage;
