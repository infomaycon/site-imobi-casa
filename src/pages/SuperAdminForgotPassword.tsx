import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, ArrowLeft, Check } from "lucide-react";

const SuperAdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: checkData, error: checkError } = await supabase.functions.invoke(
        "check-email-exists",
        { body: { email: email.trim().toLowerCase() } }
      );

      if (checkError || !checkData?.exists) {
        setError("Não existe uma conta com este email.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError("Erro ao enviar email. Tente novamente mais tarde.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Erro ao processar solicitação. Tente novamente.");
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
            <h1 className="text-2xl font-bold text-white">Recuperar Senha</h1>
            <p className="text-zinc-500 text-sm">
              {sent ? "Verifique sua caixa de entrada" : "Digite seu email para receber o link de redefinição"}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-medium text-sm">
                Enviamos um link de redefinição para <strong className="text-emerald-400">{email}</strong>
              </p>
              <p className="text-zinc-500 text-xs">
                Verifique também sua pasta de spam.
              </p>
            </div>
          ) : (
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

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Mail className="w-5 h-5 mr-2" />
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <a
              href="/super-admin-login"
              className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminForgotPassword;
