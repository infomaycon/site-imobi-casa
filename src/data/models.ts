export interface DemoModel {
  id: string;
  name: string;
  tagline: string;
  colors: { primary: string; secondary: string; bg: string; text: string; accent: string };
  style: string;
}

export const demoModels: DemoModel[] = [
  {
    id: "aurora-prime",
    name: "Aurora Prime Imóveis",
    tagline: "Elevando o padrão de viver nas grandes cidades.",
    colors: { primary: "#1a2744", secondary: "#c9a84c", bg: "#fafafa", text: "#1a1a1a", accent: "#c9a84c" },
    style: "Azul marinho + Dourado",
  },
  {
    id: "skyline-urban",
    name: "Skyline Urban Realty",
    tagline: "Exclusividade nos melhores endereços.",
    colors: { primary: "#222222", secondary: "#a0a0a0", bg: "#f8f8f8", text: "#1a1a1a", accent: "#a0a0a0" },
    style: "Preto + Prata",
  },
  {
    id: "metropolitan-elite",
    name: "Metropolitan Elite",
    tagline: "O extraordinário começa no endereço certo.",
    colors: { primary: "#3a3a3a", secondary: "#b87333", bg: "#f9f7f5", text: "#1a1a1a", accent: "#b87333" },
    style: "Cinza grafite + Cobre",
  },
  {
    id: "villa-capital",
    name: "Villa Capital Imóveis",
    tagline: "Arquitetura, localização e prestígio.",
    colors: { primary: "#6b4e37", secondary: "#d4c5a9", bg: "#faf8f5", text: "#3d2b1f", accent: "#6b4e37" },
    style: "Bege sofisticado + Marrom café",
  },
  {
    id: "urban-signature",
    name: "Urban Signature Realty",
    tagline: "Assinatura de luxo no mercado imobiliário.",
    colors: { primary: "#222222", secondary: "#b8993e", bg: "#fafafa", text: "#1a1a1a", accent: "#b8993e" },
    style: "Preto + Dourado fosco",
  },
  {
    id: "infinity-city",
    name: "Infinity City Imóveis",
    tagline: "Imóveis que acompanham seu crescimento.",
    colors: { primary: "#1a4a5c", secondary: "#2d8fa5", bg: "#f5f9fa", text: "#1a1a1a", accent: "#2d8fa5" },
    style: "Azul petróleo + Cinza claro",
  },
  {
    id: "empire-urban",
    name: "Empire Urban Living",
    tagline: "Grandes negócios para grandes conquistas.",
    colors: { primary: "#1a1a2e", secondary: "#2952cc", bg: "#f5f6fa", text: "#1a1a1a", accent: "#2952cc" },
    style: "Preto + Azul royal",
  },
  {
    id: "prime-district",
    name: "Prime District Realty",
    tagline: "O privilégio de morar nos melhores bairros.",
    colors: { primary: "#c9a84c", secondary: "#1a1a1a", bg: "#ffffff", text: "#1a1a1a", accent: "#c9a84c" },
    style: "Branco + Dourado elegante",
  },
  {
    id: "crown-city",
    name: "Crown City Imóveis",
    tagline: "Realeza no mercado imobiliário urbano.",
    colors: { primary: "#5c1a2a", secondary: "#c9a84c", bg: "#faf5f5", text: "#1a1a1a", accent: "#c9a84c" },
    style: "Vinho + Dourado",
  },
];

export interface Property {
  id: string;
  title: string;
  type: "casa" | "apartamento" | "terreno";
  price: string;
  location: string;
  area: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  image: number;
  features: string[];
  description: string;
}

export const properties: Property[] = [
  {
    id: "1", title: "Casa Moderna Vista Panorâmica", type: "casa", price: "R$ 2.850.000",
    location: "Jardins, São Paulo - SP", area: "420m²", bedrooms: 4, suites: 3, bathrooms: 5, parking: 3,
    image: 1, features: ["Piscina", "Área Gourmet", "Vista Panorâmica", "Acabamento Premium"],
    description: "Residência contemporânea com arquitetura autoral, integração total com a natureza urbana e acabamentos de altíssimo padrão.",
  },
  {
    id: "2", title: "Penthouse Duplex Sky Tower", type: "apartamento", price: "R$ 4.200.000",
    location: "Vila Olímpia, São Paulo - SP", area: "320m²", bedrooms: 3, suites: 3, bathrooms: 4, parking: 4,
    image: 2, features: ["Varanda", "Vista Panorâmica", "Acabamento Premium", "Área Gourmet"],
    description: "Cobertura duplex no topo da cidade com vista 360°, piscina privativa e ambientes projetados por arquitetos renomados.",
  },
  {
    id: "3", title: "Apartamento Alto Padrão Central", type: "apartamento", price: "R$ 1.950.000",
    location: "Itaim Bibi, São Paulo - SP", area: "185m²", bedrooms: 3, suites: 2, bathrooms: 3, parking: 2,
    image: 3, features: ["Varanda", "Acabamento Premium", "Área Gourmet"],
    description: "Apartamento sofisticado em localização privilegiada, com acabamentos nobres e infraestrutura completa de lazer.",
  },
  {
    id: "4", title: "Terreno Premium Alto da Boa Vista", type: "terreno", price: "R$ 1.200.000",
    location: "Alto da Boa Vista, São Paulo - SP", area: "800m²", bedrooms: 0, suites: 0, bathrooms: 0, parking: 0,
    image: 4, features: ["Vista Panorâmica"],
    description: "Terreno plano em condomínio fechado de alto padrão com infraestrutura completa e vista privilegiada da cidade.",
  },
  {
    id: "5", title: "Mansão Contemporânea com Piscina", type: "casa", price: "R$ 5.800.000",
    location: "Alphaville, Barueri - SP", area: "650m²", bedrooms: 5, suites: 5, bathrooms: 7, parking: 5,
    image: 5, features: ["Piscina", "Área Gourmet", "Vista Panorâmica", "Varanda", "Acabamento Premium"],
    description: "Mansão espetacular com piscina de borda infinita, home theater, adega climatizada e jardim paisagístico.",
  },
  {
    id: "6", title: "Loft Design Premium", type: "apartamento", price: "R$ 980.000",
    location: "Pinheiros, São Paulo - SP", area: "95m²", bedrooms: 1, suites: 1, bathrooms: 2, parking: 1,
    image: 6, features: ["Acabamento Premium", "Varanda"],
    description: "Loft com pé-direito duplo, cozinha gourmet integrada e acabamentos assinados por designers renomados.",
  },
];
