import { useState } from "react";
import { Search, Home, Building2, Trees, MapPin, ChevronDown, SlidersHorizontal, X, Mountain } from "lucide-react";
import type { DemoModel } from "@/data/models";

interface FilterProps {
  colors: DemoModel["colors"];
  onFilterChange?: (type: string) => void;
}

// ── Modelo 1: Aurora Prime – Filtro Horizontal Clássico ──
export const FilterHorizontalClassic = ({ colors, onFilterChange }: FilterProps) => {
  const c = colors;
  const [selectedType, setSelectedType] = useState("Todos");
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  const handleSearch = () => {
    const map: Record<string, string> = { "Todos": "todos", "Casa": "casas", "Apartamento": "apartamentos", "Terreno": "terrenos" };
    onFilterChange?.(map[selectedType] || "todos");
  };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="rounded-2xl border p-6" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Tipo de Imóvel</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Cidade / Bairro</label>
              <input type="text" placeholder="Ex: Jardins, SP" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Faixa de Preço</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Qualquer</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M - 5M</option><option>Acima de R$ 5M</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Quartos</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleSearch} className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 2: Skyline Urban – Filtro com Abas ──
export const FilterWithTabs = ({ colors, onFilterChange }: FilterProps) => {
  const [tab, setTab] = useState("comprar");
  const [selectedType, setSelectedType] = useState("Todos");
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  const handleSearch = () => {
    const map: Record<string, string> = { "Todos": "todos", "Casa": "casas", "Apartamento": "apartamentos", "Terreno": "terrenos" };
    onFilterChange?.(map[selectedType] || "todos");
  };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <div className="flex border-b" style={{ borderColor: c.text + "12" }}>
            {["comprar", "alugar", "lançamentos"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 text-sm font-display font-bold capitalize transition-all"
                style={{ backgroundColor: tab === t ? c.primary : "transparent", color: tab === t ? "#fff" : c.text + "77" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Cidade</label>
              <input type="text" placeholder="São Paulo" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Tipo de Imóvel</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Preço até</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Sem limite</option><option>R$ 1M</option><option>R$ 3M</option><option>R$ 5M</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleSearch} className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 3: Metropolitan Elite – Busca Inteligente Central ──
export const FilterSmartSearch = ({ colors, onFilterChange }: FilterProps) => {
  const c = colors;
  const [selectedType, setSelectedType] = useState("Tipo de Imóvel");
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  const handleSearch = () => {
    const map: Record<string, string> = { "Tipo de Imóvel": "todos", "Casa": "casas", "Apartamento": "apartamentos", "Terreno": "terrenos" };
    onFilterChange?.(map[selectedType] || "todos");
  };
  return (
    <div className="py-8">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h3 className="font-display font-bold text-xl mb-6" style={{ color: c.text }}>Onde você quer morar?</h3>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: c.primary }} />
          <input type="text" placeholder="Busque por cidade, bairro ou condomínio..." className="w-full pl-12 pr-4 py-4 rounded-xl border text-base font-body" style={{ ...inputStyle, boxShadow: `0 4px 20px ${c.primary}12` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <select className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option>Tipo de Imóvel</option><option>Casa</option><option>Apartamento</option><option>Terreno</option>
          </select>
          <select className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
            <option>Faixa de Preço</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M+</option>
          </select>
          <select className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
            <option>Quartos</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option>
          </select>
          <button onClick={handleSearch} className="py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
            <Search className="w-4 h-4" /> Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 4: Villa Capital – Dropdowns Avançados ──
export const FilterAdvancedDropdowns = ({ colors, onFilterChange }: FilterProps) => {
  const [open, setOpen] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const c = colors;
  const options: Record<string, string[]> = {
    cidade: ["São Paulo", "Rio de Janeiro", "Curitiba", "Brasília"],
    tipo: ["Casa", "Apartamento", "Terreno", "Cobertura"],
    preco: ["Até R$ 1M", "R$ 1M - 3M", "R$ 3M - 5M", "R$ 5M+"],
    quartos: ["1 quarto", "2 quartos", "3 quartos", "4+ quartos"],
  };
  const [selected, setSelected] = useState<Record<string, string>>({});
  const handleSelect = (key: string, value: string) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
    setOpen(null);
    if (key === "tipo") setSelectedType(value);
  };
  const handleSearch = () => {
    const map: Record<string, string> = { "Casa": "casas", "Apartamento": "apartamentos", "Terreno": "terrenos" };
    onFilterChange?.(selectedType ? (map[selectedType] || "todos") : "todos");
  };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border p-6" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(options).map(([key, opts]) => (
              <div key={key} className="relative">
                <label className="text-xs font-display font-semibold mb-1.5 block capitalize" style={{ color: c.text + "77" }}>{key}</label>
                <button onClick={() => setOpen(open === key ? null : key)} className="w-full px-3 py-2.5 rounded-lg border text-sm font-body text-left flex items-center justify-between"
                  style={{ backgroundColor: c.text + "06", borderColor: open === key ? c.primary : c.text + "18", color: c.text }}>
                  <span style={{ color: selected[key] ? c.text : c.text + "77" }}>{selected[key] || "Selecione"}</span>
                  <ChevronDown className="w-4 h-4" style={{ color: c.text + "55", transform: open === key ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {open === key && (
                  <div className="absolute z-20 top-full mt-1 w-full rounded-lg border shadow-lg py-1" style={{ backgroundColor: c.bg, borderColor: c.text + "15" }}>
                    {opts.map((o) => (
                      <button key={o} onClick={() => handleSelect(key, o)} className="w-full text-left px-3 py-2 text-sm font-body hover:brightness-95 transition-all"
                        style={{ color: c.text + "aa" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.primary + "10")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-end">
              <button onClick={handleSearch} className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 5: Urban Signature – Ícones Visuais ──
export const FilterVisualIcons = ({ colors, onFilterChange }: FilterProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  const types = [
    { id: "casa", label: "Casa", icon: Home, filter: "casas" },
    { id: "apartamento", label: "Apartamento", icon: Building2, filter: "apartamentos" },
    { id: "terreno", label: "Terreno", icon: Trees, filter: "terrenos" },
    { id: "cobertura", label: "Cobertura", icon: Mountain, filter: "todos" },
  ];
  const handleSearch = () => {
    const type = types.find((t) => t.id === selected);
    onFilterChange?.(type?.filter || "todos");
  };
  return (
    <div className="py-8">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <h3 className="font-display font-bold text-lg mb-5" style={{ color: c.text }}>O que você procura?</h3>
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {types.map((t) => (
            <button key={t.id} onClick={() => { setSelected(t.id === selected ? null : t.id); if (t.id !== selected) onFilterChange?.(t.filter); else onFilterChange?.("todos"); }}
              className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all min-w-[100px]"
              style={{ borderColor: selected === t.id ? c.primary : c.text + "15", backgroundColor: selected === t.id ? c.primary + "10" : "transparent" }}>
              <t.icon className="w-7 h-7" style={{ color: selected === t.id ? c.primary : c.text + "55" }} />
              <span className="text-xs font-display font-semibold" style={{ color: selected === t.id ? c.primary : c.text + "77" }}>{t.label}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
            <input type="text" placeholder="Cidade ou bairro" className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            <select className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
              <option>Faixa de Preço</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M+</option>
            </select>
            <button onClick={handleSearch} className="py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
              <Search className="w-4 h-4" /> Buscar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Modelo 6: Infinity City – Tags/Chips Selecionáveis ──
export const FilterChips = ({ colors }: FilterProps) => {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  const chips = ["Casa", "Apartamento", "2 quartos", "3 quartos", "4+ quartos", "Piscina", "Condomínio Fechado", "Cobertura"];
  const toggle = (chip: string) => setSelectedChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]);
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border p-6" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <label className="text-xs font-display font-semibold mb-3 block" style={{ color: c.text + "77" }}>Selecione características:</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((chip) => {
              const active = selectedChips.includes(chip);
              return (
                <button key={chip} onClick={() => toggle(chip)} className="px-4 py-2 rounded-full text-xs font-display font-semibold border transition-all"
                  style={{ backgroundColor: active ? c.primary : "transparent", color: active ? "#fff" : c.text + "88", borderColor: active ? c.primary : c.text + "20" }}>
                  {chip} {active && <X className="w-3 h-3 inline ml-1" />}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" placeholder="Cidade" className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            <select className="px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
              <option>Faixa de Preço</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M+</option>
            </select>
            <button className="py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
              <Search className="w-4 h-4" /> Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 7: Empire Urban – Busca com Mapa ──
export const FilterWithMap = ({ colors }: FilterProps) => {
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Filters sidebar */}
            <div className="lg:col-span-2 p-6 space-y-4 border-b lg:border-b-0 lg:border-r" style={{ borderColor: c.text + "12" }}>
              <h3 className="font-display font-bold text-sm flex items-center gap-2" style={{ color: c.primary }}>
                <SlidersHorizontal className="w-4 h-4" /> Filtros
              </h3>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Cidade</label>
                <input type="text" placeholder="São Paulo" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Preço</label>
                  <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                    <option>Qualquer</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Quartos</label>
                  <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                    <option>Todos</option><option>1+</option><option>2+</option><option>3+</option>
                  </select>
                </div>
              </div>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Tipo de Imóvel</option><option>Casa</option><option>Apartamento</option><option>Terreno</option>
              </select>
              <button className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar no Mapa
              </button>
            </div>
            {/* Map placeholder */}
            <div className="lg:col-span-3 relative min-h-[280px]" style={{ backgroundColor: c.text + "08" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-2" style={{ color: c.primary + "44" }} />
                  <p className="text-sm font-display font-semibold" style={{ color: c.text + "44" }}>Mapa interativo</p>
                  <p className="text-xs" style={{ color: c.text + "33" }}>Os imóveis serão exibidos aqui</p>
                </div>
              </div>
              {/* Simulated map pins */}
              {[{ top: "25%", left: "30%" }, { top: "45%", left: "55%" }, { top: "60%", left: "40%" }, { top: "35%", left: "70%" }].map((pos, i) => (
                <div key={i} className="absolute w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse" style={{ top: pos.top, left: pos.left, backgroundColor: c.primary }}>
                  <Home className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modelo 8: Prime District – Básico + Mais Filtros ──
export const FilterExpandable = ({ colors }: FilterProps) => {
  const [expanded, setExpanded] = useState(false);
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border p-6" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 8px 32px ${c.primary}10` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Cidade</label>
              <input type="text" placeholder="São Paulo" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Tipo de Imóvel</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Preço</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Qualquer</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M+</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="flex-1 py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-xs font-display font-semibold transition-all" style={{ color: c.primary }}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> {expanded ? "Menos filtros" : "Mais filtros"}
            <ChevronDown className="w-3.5 h-3.5" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {expanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: c.text + "10" }}>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Metragem mín.</label>
                <input type="text" placeholder="Ex: 100m²" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Vagas de Garagem</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                  <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Suítes</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                  <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Área do Terreno</label>
                <input type="text" placeholder="Ex: 500m²" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Modelo 9: Crown City – Premium Completo ──
export const FilterPremiumComplete = ({ colors }: FilterProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const c = colors;
  const inputStyle = { backgroundColor: c.text + "06", borderColor: c.text + "18", color: c.text };
  return (
    <div className="py-6">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="rounded-2xl border p-6" style={{ backgroundColor: c.bg, borderColor: c.text + "12", boxShadow: `0 12px 40px ${c.primary}15` }}>
          <div className="flex items-center gap-2 mb-5">
            <Search className="w-5 h-5" style={{ color: c.primary }} />
            <h3 className="font-display font-bold text-sm" style={{ color: c.text }}>Encontre seu imóvel ideal</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Cidade / Bairro</label>
              <input type="text" placeholder="Ex: Jardins, SP" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Tipo de Imóvel</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option><option>Cobertura</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Faixa de Preço</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Qualquer</option><option>Até R$ 1M</option><option>R$ 1M - 3M</option><option>R$ 3M - 5M</option><option>R$ 5M+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Quartos</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option><option>5+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: c.primary, color: "#fff" }}>
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-xs font-display font-semibold transition-all" style={{ color: c.primary }}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> {showAdvanced ? "Ocultar filtros avançados" : "Filtros avançados"}
            <ChevronDown className="w-3.5 h-3.5" style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: c.text + "10" }}>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Metragem mínima</label>
                <input type="text" placeholder="Ex: 150m²" className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Vagas de Garagem</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                  <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Suítes</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                  <option>Qualquer</option><option>1+</option><option>2+</option><option>3+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block" style={{ color: c.text + "77" }}>Diferenciais</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm font-body" style={inputStyle}>
                  <option>Todos</option><option>Piscina</option><option>Área Gourmet</option><option>Vista Panorâmica</option><option>Condomínio Fechado</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Map model ID to filter component ──
const filterMap: Record<string, React.FC<FilterProps>> = {
  "aurora-prime": FilterHorizontalClassic,
  "skyline-urban": FilterWithTabs,
  "metropolitan-elite": FilterSmartSearch,
  "villa-capital": FilterAdvancedDropdowns,
  "urban-signature": FilterVisualIcons,
  "infinity-city": FilterChips,
  "empire-urban": FilterWithMap,
  "prime-district": FilterExpandable,
  "crown-city": FilterPremiumComplete,
};

export const getSearchFilter = (modelId: string): React.FC<FilterProps> | null => {
  return filterMap[modelId] || null;
};
