import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Check } from "lucide-react";
import logo from "@/assets/imobicasa-logo.webp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verificar se o email existe no banco de dados
      // TODO: implement with new backend
      setError("Backend não configurado.");
    } catch (err) {
      setError("Erro ao processar solicitação. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6">
          <div className="text-center space-y-3">
            <img src={logo} alt="ImobiCasa" className="h-10 mx-auto" />
            <h1 className="text-2xl font-display font-bold text-foreground">Esqueci minha senha</h1>
            <p className="text-muted-foreground text-sm font-body">
              {sent
                ? "Verifique sua caixa de entrada"
                : "Digite seu email para receber o link de redefinição"}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-foreground font-medium text-sm">
                Enviamos um link de redefinição para <strong>{email}</strong>
              </p>
              <p className="text-muted-foreground text-xs">
                Verifique também sua pasta de spam.
              </p>
            </div>
          ) : (
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

              {error && <p className="text-destructive text-sm font-body">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-display font-semibold">
                <Mail className="w-5 h-5 mr-2" />
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
