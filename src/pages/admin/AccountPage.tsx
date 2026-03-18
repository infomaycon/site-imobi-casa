import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Informações da sua conta</p>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{user?.email}</p>
            <p className="text-muted-foreground text-sm font-body">Conta ativa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
