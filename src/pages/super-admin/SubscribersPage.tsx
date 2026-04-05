import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Users, CheckCircle, XCircle, Crown, Zap } from "lucide-react";

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
    refetchInterval: 10000, // Auto-refresh every 10s
  });

  const filtered = subscribers.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.plan.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const inactiveCount = subscribers.filter((s) => s.status !== "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Assinantes</h1>
        <p className="text-zinc-500 text-sm mt-1">{subscribers.length} assinantes registrados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800/60 p-4" style={{ background: "#0d0d0d" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{subscribers.length}</p>
              <p className="text-zinc-500 text-xs">Total</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 p-4" style={{ background: "#0d0d0d" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-zinc-500 text-xs">Ativos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 p-4" style={{ background: "#0d0d0d" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inactiveCount}</p>
              <p className="text-zinc-500 text-xs">Inativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, email, plano ou status..."
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
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Plano</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-zinc-500 font-medium text-xs uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-600">Carregando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-600">Nenhum assinante encontrado</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{s.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{s.email}</td>
                    <td className="px-5 py-3.5">
                      <PlanBadge plan={s.plan} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.status} />
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

const PlanBadge = ({ plan }: { plan: string }) => {
  const config: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
    premium: {
      icon: <Crown className="w-3 h-3" />,
      label: "Premium",
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    essencial: {
      icon: <Zap className="w-3 h-3" />,
      label: "Essencial",
      cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
  };

  const c = config[plan] || {
    icon: <Zap className="w-3 h-3" />,
    label: plan.charAt(0).toUpperCase() + plan.slice(1),
    cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${c.cls}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
        isActive
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
};

export default SubscribersPage;
