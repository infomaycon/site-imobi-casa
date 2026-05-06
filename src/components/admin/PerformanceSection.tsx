import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Camera, ArrowRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Lead = {
  id: string;
  name: string;
  property_title: string | null;
  created_at: string;
};

const periods = [
  { id: "7", label: "Últimos 7 dias" },
  { id: "14", label: "Últimos 14 dias" },
  { id: "30", label: "Últimos 30 dias" },
];

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const avatarColors = [
  "from-primary to-primary/60",
  "from-accent to-accent/60",
  "from-blue-500 to-blue-400",
  "from-purple-500 to-purple-400",
  "from-emerald-500 to-emerald-400",
];

const PerformanceChart = ({ days }: { days: number }) => {
  const w = 560;
  const h = 220;
  const padX = 36;
  const padY = 28;
  const [hover, setHover] = useState<number | null>(null);

  // Simulated series — deterministic shape based on days
  const visits = Array.from({ length: days }, (_, i) =>
    Math.round(120 + Math.sin(i / 1.3) * 60 + i * 8 + (i % 3) * 14)
  );
  const leads = Array.from({ length: days }, (_, i) =>
    Math.round(8 + Math.cos(i / 1.6) * 4 + i * 0.6 + (i % 4))
  );

  const maxV = Math.max(...visits, 1);
  const maxL = Math.max(...leads, 1);

  const stepX = (w - padX * 2) / (days - 1);
  const yV = (v: number) => padY + (1 - v / (maxV * 1.1)) * (h - padY * 2);
  const yL = (v: number) => padY + (1 - v / (maxL * 1.1)) * (h - padY * 2);

  const toPath = (arr: number[], y: (v: number) => number) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"} ${padX + i * stepX} ${y(v)}`).join(" ");
  const toArea = (arr: number[], y: (v: number) => number) =>
    `${toPath(arr, y)} L ${padX + (arr.length - 1) * stepX} ${h - padY} L ${padX} ${h - padY} Z`;

  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // ticks (4 horizontal grid lines)
  const ticks = [0, 0.33, 0.66, 1].map((t) => padY + t * (h - padY * 2));

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="grad-visits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-leads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.32" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </linearGradient>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {ticks.map((y, i) => (
          <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke="hsl(var(--border))" strokeOpacity="0.5" strokeDasharray="3 4" />
        ))}

        {/* Areas */}
        <motion.path
          d={toArea(visits, yV)}
          fill="url(#grad-visits)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={toArea(leads, yL)}
          fill="url(#grad-leads)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />

        {/* Lines */}
        <motion.path
          d={toPath(visits, yV)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-line)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.path
          d={toPath(leads, yL)}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-line)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        />

        {/* Hover layer */}
        {visits.map((_, i) => {
          const x = padX + i * stepX;
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={x - stepX / 2} y={0} width={stepX} height={h} fill="transparent" />
              {hover === i && (
                <>
                  <line x1={x} x2={x} y1={padY} y2={h - padY} stroke="hsl(var(--foreground))" strokeOpacity="0.25" strokeDasharray="3 3" />
                  <circle cx={x} cy={yV(visits[i])} r="5" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="2" />
                  <circle cx={x} cy={yL(leads[i])} r="5" fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth="2" />
                </>
              )}
            </g>
          );
        })}

        {/* X labels (sparse) */}
        {labels.map((l, i) => {
          const stepLabel = Math.max(1, Math.floor(days / 6));
          if (i % stepLabel !== 0 && i !== days - 1) return null;
          return (
            <text
              key={i}
              x={padX + i * stepX}
              y={h - 8}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              className="font-body"
            >
              {l}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg glass-panel px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${((padX + hover * stepX) / w) * 100}%`,
            top: `${(yV(visits[hover]) / h) * 100}%`,
          }}
        >
          <p className="font-display font-semibold text-foreground mb-1">{labels[hover]}</p>
          <p className="flex items-center gap-1.5 text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-primary" /> Visitas: <strong className="text-foreground">{visits[hover]}</strong>
          </p>
          <p className="flex items-center gap-1.5 text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-accent" /> Leads: <strong className="text-foreground">{leads[hover]}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

const PerformanceSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState(periods[0]);
  const [openPeriod, setOpenPeriod] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, name, property_title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setLeads((data ?? []) as Lead[]);
    };
    load();
  }, [user]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5"
    >
      {/* Performance chart */}
      <div className="lg:col-span-7 glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">Desempenho do seu site</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                Visitas
              </span>
              <span className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
                Leads
              </span>
            </div>
          </div>

          {/* Period picker */}
          <div className="relative">
            <button
              onClick={() => setOpenPeriod((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/60 text-xs font-body font-medium text-foreground/80 transition-colors"
            >
              {period.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openPeriod && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpenPeriod(false)} />
                <div className="absolute right-0 mt-2 w-44 rounded-xl glass-panel shadow-xl p-1 z-40">
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPeriod(p);
                        setOpenPeriod(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-body transition-colors ${
                        period.id === p.id ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <PerformanceChart days={parseInt(period.id)} />
      </div>

      {/* Recent leads */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-5 md:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground text-lg">Leads recentes</h3>
          <button
            onClick={() => navigate("/admin/leads")}
            className="text-xs font-body font-medium text-primary hover:underline flex items-center gap-1"
          >
            Ver todos
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-body text-muted-foreground">Nenhum lead ainda.</p>
            <p className="text-xs font-body text-muted-foreground/70 mt-1">Eles aparecerão aqui em tempo real.</p>
          </div>
        ) : (
          <ul className="space-y-1 -mx-2">
            {leads.map((lead, i) => (
              <li key={lead.id}>
                <button
                  onClick={() => navigate("/admin/leads")}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-xs font-display font-bold shadow-md shrink-0`}>
                    {initials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-[11px] font-body text-muted-foreground truncate">
                      {lead.property_title || "Contato geral"}
                    </p>
                  </div>
                  <span className="text-[10px] font-body text-muted-foreground shrink-0 tabular-nums">
                    {timeAgo(lead.created_at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tips card */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative flex-1 flex flex-col">
          <h3 className="font-display font-bold text-foreground text-lg mb-3">Dicas para vender mais</h3>

          <div className="w-12 h-12 rounded-xl bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center mb-3 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)]">
            <Camera className="w-5 h-5 text-primary" />
          </div>

          <p className="text-sm font-body text-foreground/85 leading-relaxed flex-1">
            Imóveis com fotos profissionais{" "}
            <span className="font-display font-bold text-primary">recebem até 3x</span> mais contatos!
          </p>

          <button
            onClick={() => navigate("/admin/help")}
            className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/15 border border-border/60 text-xs font-display font-semibold text-foreground transition-all hover:scale-[1.02] group"
          >
            Saiba mais
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default PerformanceSection;