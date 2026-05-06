import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const { data: subscribers = [] } = useQuery({
    queryKey: ["super-subscribers"],
    queryFn: async () => {
      // TODO: fetch from new backend
      return [];
    },
  });

  const active = subscribers.filter((s) => s.status === "active");
  const totalRevenue = active.reduce((sum, s) => sum + Number(s.plan_value || 0), 0);
  const ticketMedio = active.length > 0 ? totalRevenue / active.length : 0;

  // Generate monthly chart data from subscribers
  const chartData = (() => {
    const months: Record<string, number> = {};
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    active.forEach((s) => {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months[key] = (months[key] || 0) + Number(s.plan_value || 0);
    });
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      return { name: labels[d.getMonth()], valor: months[key] || 0 };
    });
  })();

  const lastMonth = chartData[chartData.length - 2]?.valor || 0;
  const thisMonth = chartData[chartData.length - 1]?.valor || 0;
  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  const stats = [
    {
      label: "Receita Mensal",
      value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "emerald",
      trend: growth,
    },
    {
      label: "Assinantes Ativos",
      value: active.length.toString(),
      icon: Users,
      color: "blue",
      trend: null,
    },
    {
      label: "Ticket Médio",
      value: `R$ ${ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: BarChart3,
      color: "violet",
      trend: null,
    },
    {
      label: "Crescimento",
      value: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`,
      icon: Zap,
      color: growth >= 0 ? "emerald" : "red",
      trend: growth,
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-emerald-500/5" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "shadow-blue-500/5" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", glow: "shadow-violet-500/5" },
    red: { bg: "bg-red-500/10", text: "text-red-400", glow: "shadow-red-500/5" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral da plataforma</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const c = colorMap[stat.color] || colorMap.emerald;
          return (
            <div
              key={stat.label}
              className={`rounded-xl border border-zinc-800/60 p-5 shadow-lg ${c.glow}`}
              style={{ background: "#0d0d0d" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-[18px] h-[18px] ${c.text}`} />
                </div>
                {stat.trend !== null && (
                  <span className={`text-xs flex items-center gap-0.5 ${stat.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stat.trend).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-zinc-800/60 p-6" style={{ background: "#0d0d0d" }}>
        <h2 className="text-white font-semibold mb-6">Faturamento Mensal</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="neonGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#161616", border: "1px solid #27272a", borderRadius: 8, color: "#fff" }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Faturamento"]}
              />
              <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={2} fill="url(#neonGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
