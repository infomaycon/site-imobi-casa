import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star, Eye, EyeOff, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

const PropertyList = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProperties = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    setProperties(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("properties").update({ active: !current }).eq("id", id);
    fetchProperties();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from("properties").update({ featured: !current }).eq("id", id);
    fetchProperties();
  };

  const duplicateProperty = async (property: Property) => {
    if (!user) return;
    const { id, created_at, updated_at, ...rest } = property;
    await supabase.from("properties").insert({ ...rest, title: `${rest.title} (cópia)`, user_id: user.id });
    fetchProperties();
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;
    await supabase.from("properties").delete().eq("id", id);
    fetchProperties();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.location || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-muted-foreground font-body text-center py-12">Carregando imóveis...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Lista de Imóveis</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{properties.length} imóveis cadastrados</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imóvel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl p-12 shadow-soft text-center">
          <p className="text-muted-foreground font-body">Nenhum imóvel encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((property) => (
            <div key={property.id} className="bg-card rounded-xl p-4 shadow-soft flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Thumbnail */}
              <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-body">
                    Sem foto
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground truncate">{property.title}</h3>
                  {property.featured && <Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" />}
                  {!property.active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body flex-shrink-0">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm font-body">{property.location || "Sem localização"}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-primary font-display font-bold">{formatPrice(property.price)}</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body capitalize">
                    {property.status}
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body capitalize">
                    {property.property_type}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => toggleFeatured(property.id, property.featured)} title="Destacar">
                  <Star className={`w-4 h-4 ${property.featured ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleActive(property.id, property.active)} title={property.active ? "Desativar" : "Ativar"}>
                  {property.active ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => duplicateProperty(property)} title="Duplicar">
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" title="Editar">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteProperty(property.id)} title="Excluir">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
