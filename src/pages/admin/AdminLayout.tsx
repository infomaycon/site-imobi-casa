import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriberAccess } from "@/hooks/useSubscriberAccess";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import WelcomeDialog from "@/components/admin/WelcomeDialog";
import TrialEndingBanner from "@/components/admin/TrialEndingBanner";
import { Menu, ShieldX, AlertTriangle } from "lucide-react";

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isAuthorized, isActive, isLoading: subLoading } = useSubscriberAccess();

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="animate-pulse text-muted-foreground font-body">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email not in subscribers table
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="bg-card rounded-2xl shadow-soft p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Acesso não autorizado</h2>
          <p className="text-muted-foreground text-sm font-body">
            O email <strong>{user.email}</strong> não possui uma assinatura ativa na plataforma.
          </p>
          <button
            onClick={async () => { await signOut(); window.location.href = "/login"; }}
            className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  // Subscriber exists but status is not active
  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="bg-card rounded-2xl shadow-soft p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Seu acesso está inativo</h2>
          <p className="text-muted-foreground text-sm font-body">
            Sua assinatura está suspensa. Entre em contato com o suporte para reativar.
          </p>
          <button
            onClick={async () => { await signOut(); window.location.href = "/login"; }}
            className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: "#f5f5f5" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 flex items-center border-b border-border bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h2 className="text-lg font-display font-semibold text-foreground">Painel Administrativo</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <TrialEndingBanner />
            <Outlet />
          </main>
        </div>
        <WelcomeDialog />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
