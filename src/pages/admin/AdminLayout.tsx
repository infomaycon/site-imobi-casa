import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriberAccess } from "@/hooks/useSubscriberAccess";
import AdminTopNav from "@/components/admin/AdminTopNav";
import WelcomeDialog from "@/components/admin/WelcomeDialog";
import TrialEndingBanner from "@/components/admin/TrialEndingBanner";
import TrialExpiredOverlay from "@/components/admin/TrialExpiredOverlay";
import { AdminThemeProvider } from "@/hooks/useAdminTheme";
import { ShieldX, AlertTriangle } from "lucide-react";

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isAuthorized, isActive, isLoading: subLoading } = useSubscriberAccess();

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <div className="min-h-screen flex items-center justify-center bg-background">
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
    <AdminThemeProvider>
      <div className="min-h-screen flex flex-col w-full bg-background text-foreground transition-colors">
        {/* Ambient background flourish */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-accent/10 blur-[140px]" />
        </div>
        <AdminTopNav />
        <main className="flex-1 px-4 lg:px-6 py-6 overflow-auto max-w-[1500px] w-full mx-auto">
          <TrialEndingBanner />
          <Outlet />
        </main>
        <WelcomeDialog />
        <TrialExpiredOverlay />
      </div>
    </AdminThemeProvider>
  );
};

export default AdminLayout;
