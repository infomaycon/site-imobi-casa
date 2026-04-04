import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
};

const SubscribersPage = () => {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: subscribers = [] } = useQuery({
    queryKey: ["super-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const plans = [...new Set(subscribers.map((s) => s.plan))];

  const filtered = subscribers.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (planFilter !== "all" && s.plan !== planFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Assinantes</h1>
        <p className="text-zinc-500 text-sm mt-1">{subscribers.length} assinantes registrados</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-600" />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">Todos os planos</option>
            {plans.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800/60 overflow-hidden" style={{ background: "#0d0d0d" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Plano</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Valor</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-600">Nenhum assinante encontrado</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{s.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{s.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-medium">
                        {s.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-emerald-400 font-medium">
                      R$ {Number(s.plan_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${statusColors[s.status] || statusColors.inactive}`}>
                        {s.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
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
