import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Check } from "lucide-react";
import logo from "@/assets/imobicasa-logo.webp";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    // TODO: implement with new backend
    return () => {};
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    // TODO: implement with new backend
    const error = new Error("Backend não configurado.");

    if (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="w-full max-w-md mx-4">
          <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6 text-center">
            <img src={logo} alt="ImobiCasa" className="h-10 mx-auto" />
            <h1 className="text-xl font-display font-bold text-foreground">Link inválido</h1>
            <p className="text-muted-foreground text-sm">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Voltar ao login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6">
          <div className="text-center space-y-3">
            <img src={logo} alt="ImobiCasa" className="h-10 mx-auto" />
            <h1 className="text-2xl font-display font-bold text-foreground">Redefinir Senha</h1>
            <p className="text-muted-foreground text-sm font-body">Digite sua nova senha abaixo</p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-foreground font-medium">Senha redefinida com sucesso!</p>
              <p className="text-muted-foreground text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-body">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-body">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {error && <p className="text-destructive text-sm font-body">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-display font-semibold">
                <KeyRound className="w-5 h-5 mr-2" />
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
