import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/imobicasa-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError("Email ou senha incorretos.");
    } else {
      navigate(redirectTo);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6">
          <div className="text-center space-y-3">
            <a href="/">
              <img src={logo} alt="ImobiCasa" className="h-10 mx-auto" />
            </a>
            <h1 className="text-2xl font-display font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground text-sm font-body">Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-body">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-body">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm font-body">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-display font-semibold">
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
