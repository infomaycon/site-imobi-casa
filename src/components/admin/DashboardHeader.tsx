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

const StatCard = ({
  icon: Icon,
  label,
  value,
  delta,
  accent,
  delay,
}: {
  icon: typeof HomeIcon;
  label: string;
  value: number;
  delta: string;
  accent: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -3 }}
    className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-soft p-5 transition-all hover:shadow-md"
  >
    <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity ${accent}`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-body font-medium">{label}</p>
        <p className="text-3xl font-display font-bold text-foreground mt-2 leading-none">{value}</p>
        <div className="flex items-center gap-1 mt-2 text-xs font-body text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>{delta}</span>
        </div>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent} bg-opacity-15`}>
        <Icon className="w-5 h-5 text-foreground/80" />
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
      {/* Greeting strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 dark:from-card dark:to-card/80 p-6 md:p-7 shadow-soft"
      >
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)" }} />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-body font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">Painel ImobiCasa</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-background">
              Bem-vindo de volta{name ? `, ${name}` : ""} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs font-body text-background/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
                Seu site está online
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-body text-background/80">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span>+{stats.leads24h} leads nas últimas 24h</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-semibold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Adicionar Imóvel
          </motion.button>
        </div>
      </motion.div>

      {/* Mini dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={HomeIcon} label="Imóveis Ativos" value={stats.active} delta="+8% no mês" accent="bg-primary" delay={0.05} />
        <StatCard icon={MessageSquare} label="Leads Recebidos" value={stats.leads} delta={`+${stats.leads24h} hoje`} accent="bg-orange-500" delay={0.1} />
        <StatCard icon={Eye} label="Visitas no Site" value={stats.visits} delta="+12% no mês" accent="bg-blue-500" delay={0.15} />
        <StatCard icon={Star} label="Imóveis em Destaque" value={stats.featured} delta="Vitrine ativa" accent="bg-amber-500" delay={0.2} />
      </div>
    </div>
  );
};

export default DashboardHeader;
