import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError("Credenciais inválidas.");
    } else {
      navigate("/super-admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl border border-zinc-800/60 p-8 space-y-6" style={{ background: "#0a0a0a" }}>
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Acesso Restrito</h1>
            <p className="text-zinc-500 text-sm">Painel exclusivo do administrador</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 text-sm">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors">
                Esqueci minha senha
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Shield className="w-5 h-5 mr-2" />
              {loading ? "Verificando..." : "Acessar Painel"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
