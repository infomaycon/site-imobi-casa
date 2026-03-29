export interface DemoModel {
  id: string;
  name: string;
  tagline: string;
  colors: { primary: string; secondary: string; bg: string; text: string; accent: string };
  style: string;
}

export const demoModels: DemoModel[] = [
  {
    id: "empire-urban",
    name: "Empire Urban Living",
    tagline: "Grandes negócios para grandes conquistas.",
    colors: { primary: "#138c76", secondary: "#2952cc", bg: "#f5f6fa", text: "#1a1a1a", accent: "#138c76" },
    style: "Verde esmeralda escuro",
  },
  {
    id: "prime-district",
    name: "Prime District Realty",
    tagline: "O privilégio de morar nos melhores bairros.",
    colors: { primary: "#ef2e2e", secondary: "#1a1a1a", bg: "#ffffff", text: "#1a1a1a", accent: "#ef2e2e" },
    style: "Vermelho vivo",
  },
  {
    id: "crown-city",
    name: "Crown City Imóveis",
    tagline: "Realeza no mercado imobiliário urbano.",
    colors: { primary: "#10e67f", secondary: "#c9a84c", bg: "#faf5f5", text: "#1a1a1a", accent: "#10e67f" },
    style: "Verde neon",
  },
  {
    id: "villa-capital",
    name: "Villa Capital Imóveis",
    tagline: "Arquitetura, localização e prestígio.",
    colors: { primary: "#cb0000", secondary: "#d4c5a9", bg: "#faf8f5", text: "#3d2b1f", accent: "#cb0000" },
    style: "Vermelho intenso",
  },
  {
    id: "urban-signature",
    name: "Urban Signature Realty",
    tagline: "Assinatura de luxo no mercado imobiliário.",
    colors: { primary: "#e71b6b", secondary: "#b8993e", bg: "#fafafa", text: "#1a1a1a", accent: "#e71b6b" },
    style: "Rosa vibrante",
  },
  {
    id: "infinity-city",
    name: "Infinity City Imóveis",
    tagline: "Imóveis que acompanham seu crescimento.",
    colors: { primary: "#6c439b", secondary: "#2d8fa5", bg: "#f5f9fa", text: "#1a1a1a", accent: "#6c439b" },
    style: "Roxo elegante",
  },
  {
    id: "aurora-prime",
    name: "Aurora Prime Imóveis",
    tagline: "Elevando o padrão de viver nas grandes cidades.",
    colors: { primary: "#f46602", secondary: "#c9a84c", bg: "#fafafa", text: "#1a1a1a", accent: "#f46602" },
    style: "Laranja vibrante",
  },
  {
    id: "skyline-urban",
    name: "Skyline Urban Realty",
    tagline: "Exclusividade nos melhores endereços.",
    colors: { primary: "#00a8ad", secondary: "#a0a0a0", bg: "#f8f8f8", text: "#1a1a1a", accent: "#00a8ad" },
    style: "Teal moderno",
  },
  {
    id: "metropolitan-elite",
    name: "Metropolitan Elite",
    tagline: "O extraordinário começa no endereço certo.",
    colors: { primary: "#00bf63", secondary: "#b87333", bg: "#f9f7f5", text: "#1a1a1a", accent: "#00bf63" },
    style: "Verde esmeralda",
  },
];

export interface Property {
  id: string;
  title: string;
  type: "casa" | "apartamento" | "terreno";
  status?: "venda" | "aluguel";
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
    id: "6", title: "Loft Design Premium", type: "apartamento", status: "aluguel", price: "R$ 6.500/mês",
    location: "Pinheiros, São Paulo - SP", area: "95m²", bedrooms: 1, suites: 1, bathrooms: 2, parking: 1,
    image: 6, features: ["Acabamento Premium", "Varanda"],
    description: "Loft com pé-direito duplo, cozinha gourmet integrada e acabamentos assinados por designers renomados.",
  },
  {
    id: "7", title: "Cobertura Triplex Jardins", type: "apartamento", price: "R$ 7.500.000",
    location: "Jardim Europa, São Paulo - SP", area: "520m²", bedrooms: 4, suites: 4, bathrooms: 6, parking: 4,
    image: 1, features: ["Piscina", "Vista Panorâmica", "Área Gourmet", "Acabamento Premium"],
    description: "Cobertura triplex com terraço panorâmico, piscina aquecida e acabamentos em mármore importado.",
  },
  {
    id: "8", title: "Casa de Campo Luxuosa", type: "casa", price: "R$ 3.200.000",
    location: "Granja Viana, Cotia - SP", area: "480m²", bedrooms: 5, suites: 3, bathrooms: 5, parking: 4,
    image: 2, features: ["Piscina", "Área Gourmet", "Varanda"],
    description: "Casa de campo em condomínio fechado com amplo jardim, churrasqueira gourmet e quadra de tênis.",
  },
  {
    id: "9", title: "Studio Moderno Faria Lima", type: "apartamento", status: "aluguel", price: "R$ 4.200/mês",
    location: "Faria Lima, São Paulo - SP", area: "45m²", bedrooms: 1, suites: 1, bathrooms: 1, parking: 1,
    image: 3, features: ["Acabamento Premium"],
    description: "Studio compacto e funcional na região mais valorizada da cidade, ideal para investimento ou moradia.",
  },
  {
    id: "10", title: "Terreno Condomínio Fechado", type: "terreno", price: "R$ 890.000",
    location: "Tamboré, Santana de Parnaíba - SP", area: "600m²", bedrooms: 0, suites: 0, bathrooms: 0, parking: 0,
    image: 4, features: ["Vista Panorâmica"],
    description: "Terreno em condomínio de alto padrão com segurança 24h, área verde preservada e infraestrutura completa.",
  },
  {
    id: "11", title: "Apartamento Garden Premium", type: "apartamento", status: "aluguel", price: "R$ 12.000/mês",
    location: "Moema, São Paulo - SP", area: "210m²", bedrooms: 3, suites: 2, bathrooms: 4, parking: 3,
    image: 5, features: ["Área Gourmet", "Varanda", "Acabamento Premium"],
    description: "Garden com quintal privativo de 80m², perfeito para famílias que buscam espaço e sofisticação na cidade.",
  },
  {
    id: "12", title: "Casa Contemporânea Brooklin", type: "casa", price: "R$ 4.500.000",
    location: "Brooklin Novo, São Paulo - SP", area: "380m²", bedrooms: 4, suites: 4, bathrooms: 5, parking: 3,
    image: 6, features: ["Piscina", "Área Gourmet", "Acabamento Premium", "Varanda"],
    description: "Residência moderna com fachada em vidro e concreto aparente, piscina com deck e automação completa.",
  },
];
