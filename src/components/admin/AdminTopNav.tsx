import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Globe,
  FileText,
  Palette,
  Settings,
  User as UserIcon,
  Bell,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriberAccess } from "@/hooks/useSubscriberAccess";
import { useAdminTheme, AdminTheme } from "@/hooks/useAdminTheme";
import logo from "@/assets/imobicasa-logo.webp";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Imóveis", to: "/admin/properties", icon: Building2 },
  { label: "Leads", to: "/admin/leads", icon: MessageSquare },
  { label: "Site", to: "/admin/appearance", icon: Globe },
  { label: "Conteúdo", to: "/admin/content", icon: FileText },
  { label: "Aparência", to: "/admin/appearance", icon: Palette },
  { label: "Configurações", to: "/admin/settings", icon: Settings },
  { label: "Conta", to: "/admin/account", icon: UserIcon },
];

const themeIcon = (t: AdminTheme) =>
  t === "light" ? Sun : t === "dark" ? Moon : Sparkles;

const AdminTopNav = () => {
  const { user, signOut } = useAuth();
  const { subscriber } = useSubscriberAccess();
  const { theme, setTheme } = useAdminTheme();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const [unread, setUnread] = useState(0);

  const name = subscriber?.name || user?.email?.split("@")[0] || "";
  const planLabel = subscriber?.plan
    ? subscriber.plan.charAt(0).toUpperCase() + subscriber.plan.slice(1)
    : "Trial";
  const initials = name.slice(0, 2).toUpperCase();

  // Fetch unread leads count
  useEffect(() => {
    if (!user) return;
    // TODO: fetch from new backend
    setUnread(0);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const ThemeIcon = themeIcon(theme);

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-border/60">
      {/* subtle glow underline */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <img src={logo} alt="ImobiCasa" className="h-7" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/10 ring-1 ring-primary/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1 lg:flex-none" />

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => navigate("/admin/leads")}
            className="relative w-10 h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/60 flex items-center justify-center transition-all hover:scale-105"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4 text-foreground/80" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <div className="relative">
            <button
              onClick={() => setOpenTheme((o) => !o)}
              className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/60 flex items-center justify-center transition-all hover:scale-105"
              aria-label="Trocar tema"
            >
              <ThemeIcon className="w-4 h-4 text-foreground/80" />
            </button>
            <AnimatePresence>
              {openTheme && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpenTheme(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-xl p-2 z-40"
                  >
                    <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-body font-semibold">
                      Escolha seu tema
                    </p>
                    {[
                      { id: "light" as AdminTheme, label: "Claro", desc: "Refinado e limpo", Icon: Sun },
                      { id: "dark" as AdminTheme, label: "Profissional", desc: "Escuro sofisticado", Icon: Moon },
                      { id: "black" as AdminTheme, label: "Preto Premium", desc: "Luxo absoluto", Icon: Sparkles },
                    ].map((opt) => {
                      const active = theme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setTheme(opt.id);
                            setOpenTheme(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            active ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-foreground/5"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-primary/20 text-primary" : "bg-foreground/5 text-foreground/70"}`}>
                            <opt.Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-display font-semibold text-foreground">{opt.label}</p>
                            <p className="text-[11px] text-muted-foreground font-body">{opt.desc}</p>
                          </div>
                          {active && <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setOpenUser((o) => !o)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/60 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-display font-bold shadow-md">
                {initials || <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-display font-semibold text-foreground truncate max-w-[110px]">{name || "Usuário"}</p>
                <p className="text-[10px] text-primary font-body font-medium">Plano {planLabel}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
            </button>
            <AnimatePresence>
              {openUser && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpenUser(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel shadow-xl p-2 z-40"
                  >
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-display font-semibold text-foreground">{name}</p>
                      <p className="text-[11px] text-muted-foreground font-body truncate">{user?.email}</p>
                    </div>
                    <div className="h-px bg-border/60 my-1" />
                    <button
                      onClick={() => { setOpenUser(false); navigate("/admin/account"); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-body text-foreground/80 hover:bg-foreground/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> Minha conta
                    </button>
                    <a
                      href="/demo/model1"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpenUser(false)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-body text-primary hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Ver meu site
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpenMenu((o) => !o)}
            className="lg:hidden w-10 h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/60 flex items-center justify-center"
            aria-label="Menu"
          >
            {openMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {openMenu && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/60 bg-background/80 backdrop-blur-xl"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpenMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-body font-medium transition-colors ${
                      isActive ? "bg-primary/15 text-foreground ring-1 ring-primary/30" : "text-muted-foreground hover:bg-foreground/5"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminTopNav;