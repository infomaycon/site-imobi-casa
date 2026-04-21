import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/imobicasa-logo.webp";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    const { error: signUpError } = await signUp(email, password);
    if (signUpError) {
      setLoading(false);
      setError(signUpError.message || "Erro ao criar conta.");
      return;
    }
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setInfo("Conta criada! Verifique seu email para confirmar antes de entrar.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6">
          <div className="text-center space-y-3">
            <a href="/"><img src={logo} alt="ImobiCasa" className="h-10 mx-auto" /></a>
            <h1 className="text-2xl font-display font-bold text-foreground">Criar Conta</h1>
            <p className="text-muted-foreground text-sm font-body">Comece seu teste gratuito de 7 dias</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-body">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-body">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres"
                  value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-destructive text-sm font-body">{error}</p>}
            {info && <p className="text-primary text-sm font-body">{info}</p>}
            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-display font-semibold">
              <UserPlus className="w-5 h-5 mr-2" />
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-body">
            Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
          <div className="text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">← Voltar ao site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
