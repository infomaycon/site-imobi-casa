import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search } from "lucide-react";

const SubscribersPage = () => {
  const [search, setSearch] = useState("");

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["super-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = subscribers.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Assinantes</h1>
        <p className="text-zinc-500 text-sm mt-1">{subscribers.length} assinantes registrados</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800/60 overflow-hidden" style={{ background: "#0d0d0d" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-zinc-600">Carregando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-zinc-600">Nenhum assinante encontrado</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{s.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{s.email}</td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {new Date(s.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscribersPage;
