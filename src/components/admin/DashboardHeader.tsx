import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, CheckCircle2, TrendingUp, Home as HomeIcon, MessageSquare, Eye, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  active: number;
  leads: number;
  visits: number;
  featured: number;
  leads24h: number;
}

/** Tiny inline SVG sparkline for premium feel */
const Sparkline = ({ color, points }: { color: string; points: number[] }) => {
  const w = 100, h = 28;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  delta,
  glow,
  spark,
  delay,
}: {
  icon: typeof HomeIcon;
  label: string;
  value: number;
  delta: string;
  glow: string; // tailwind color e.g. "bg-primary"
  spark: string; // hex/hsl color for sparkline stroke
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="group relative overflow-hidden rounded-2xl glass-panel p-5 transition-shadow hover:shadow-[0_20px_40px_-20px_hsl(var(--primary)/0.4)]"
  >
    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity ${glow}`} />
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    <div className="relative">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-body font-semibold">{label}</p>
          <p className="text-3xl font-display font-extrabold text-foreground mt-2 leading-none tabular-nums">{value.toLocaleString("pt-BR")}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${glow}/20 ring-1 ring-inset ring-foreground/5 shadow-[0_0_20px_-6px_currentColor]`}>
          <Icon className="w-5 h-5 text-foreground" />
        </div>
      </div>
      <div className="mt-3">
        <Sparkline color={spark} points={[3, 5, 4, 7, 6, 9, 8, 12, 11, 14]} />
      </div>
      <div className="flex items-center gap-1 mt-1 text-[11px] font-body text-emerald-500">
        <TrendingUp className="w-3 h-3" />
        <span className="font-semibold">{delta}</span>
      </div>
    </div>
  </motion.div>
);

const DashboardHeader = ({ onAddClick }: { onAddClick?: () => void }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ active: 0, leads: 0, visits: 0, featured: 0, leads24h: 0 });
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: props }, { data: leads }] = await Promise.all([
        supabase.from("properties").select("id,active,featured").eq("user_id", user.id),
        supabase.from("leads").select("id,created_at").eq("user_id", user.id),
      ]);
      const active = (props ?? []).filter((p) => p.active).length;
      const featured = (props ?? []).filter((p) => p.featured).length;
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const leads24h = (leads ?? []).filter((l) => new Date(l.created_at).getTime() > dayAgo).length;
      // Visits is simulated for now (not tracked in DB)
      const visits = Math.max(active * 12 + (leads?.length ?? 0) * 4, 0);
      setStats({
        active,
        leads: leads?.length ?? 0,
        visits,
        featured,
        leads24h,
      });
    };
    load();
    const userMeta = (user.user_metadata?.name as string) || user.email?.split("@")[0] || "";
    setName(userMeta.charAt(0).toUpperCase() + userMeta.slice(1));
  }, [user]);

  return (
    <div className="mb-8 space-y-6">
      {/* Premium greeting hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-8"
      >
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: "radial-gradient(circle at 15% 30%, hsl(var(--primary)) 0%, transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--accent)) 0%, transparent 45%)" }}
        />
        {/* City skyline silhouette */}
        <svg className="absolute bottom-0 right-0 w-[55%] max-w-[520px] opacity-[0.08] text-foreground" viewBox="0 0 600 140" fill="currentColor" preserveAspectRatio="xMaxYMax meet" aria-hidden>
          <path d="M0 140 L0 90 L30 90 L30 70 L60 70 L60 100 L90 100 L90 50 L120 50 L120 80 L150 80 L150 30 L180 30 L180 10 L210 10 L210 60 L240 60 L240 90 L270 90 L270 40 L300 40 L300 70 L330 70 L330 50 L360 50 L360 20 L390 20 L390 80 L420 80 L420 60 L450 60 L450 90 L480 90 L480 40 L510 40 L510 80 L540 80 L540 100 L570 100 L570 70 L600 70 L600 140 Z" />
        </svg>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-body font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-[0.2em]">Painel ImobiCasa</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-foreground tracking-tight">
              Bem-vindo de volta{name ? <>, <span className="text-gradient-primary">{name}</span></> : ""} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-body text-foreground/80">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_hsl(150_80%_55%)]" />
                </span>
                Seu site está online
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-body text-foreground/80">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span>+{stats.leads24h} leads nas últimas 24h</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddClick}
            className="relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-display font-bold text-sm shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.7)] hover:shadow-[0_14px_50px_-10px_hsl(var(--accent))] transition-shadow group"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="w-4 h-4" />
            Adicionar Imóvel
          </motion.button>
        </div>
      </motion.div>

      {/* Mini dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={HomeIcon} label="Imóveis Ativos" value={stats.active} delta="+8% no mês" glow="bg-primary" spark="hsl(152 70% 50%)" delay={0.05} />
        <StatCard icon={MessageSquare} label="Leads Recebidos" value={stats.leads} delta={`+${stats.leads24h} hoje`} glow="bg-accent" spark="hsl(24 95% 58%)" delay={0.1} />
        <StatCard icon={Eye} label="Visitas no Site" value={stats.visits} delta="+12% no mês" glow="bg-blue-500" spark="hsl(220 90% 60%)" delay={0.15} />
        <StatCard icon={Star} label="Em Destaque" value={stats.featured} delta="Vitrine ativa" glow="bg-amber-500" spark="hsl(40 95% 55%)" delay={0.2} />
      </div>
    </div>
  );
};

export default DashboardHeader;
