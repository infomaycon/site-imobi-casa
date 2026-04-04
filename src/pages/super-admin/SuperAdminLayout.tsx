import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { LayoutDashboard, Users, CreditCard, LogOut, Shield, Crown } from "lucide-react";

const navItems = [
  { to: "/super-admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/super-admin/subscribers", icon: CreditCard, label: "Assinantes" },
  { to: "/super-admin/users", icon: Users, label: "Usuários" },
];

const SuperAdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { hasSuperAccess, roleLoading, isOwner } = useSuperAdmin();
  const navigate = useNavigate();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm">Verificando acesso...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!hasSuperAccess) return <Navigate to="/" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#000" }}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/60 flex flex-col" style={{ background: "#0a0a0a" }}>
        <div className="p-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-wide">Super Admin</h1>
              <span className="text-zinc-600 text-[11px] flex items-center gap-1">
                {isOwner ? <Crown className="w-3 h-3 text-amber-400" /> : null}
                {isOwner ? "Owner" : "Admin"}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800/60 space-y-1">
          <div className="px-3 py-2 text-[11px] text-zinc-600 truncate">{user.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
