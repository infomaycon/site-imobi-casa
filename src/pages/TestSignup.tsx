import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { testSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const TestSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { data, error } = await testSupabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: `${window.location.origin}/test-dashboard` },
    });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const { error: profileError } = await testSupabase.from("profiles" as any).insert({
        id: user.id,
        email: user.email,
        plano: "free",
        status: "active",
        trial: true,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
      });
      if (profileError) {
        setLoading(false);
        setError(`Conta criada, mas erro ao criar profile: ${profileError.message}`);
        return;
      }
    }

    setLoading(false);
    if (data.session) {
      navigate("/test-dashboard");
    } else {
      setError("Cadastro criado. Verifique seu email para confirmar antes de entrar.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8 space-y-6 border">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Cadastro (Teste)</h1>
          <p className="text-sm text-muted-foreground">Supabase externo: conuhvxiiwdsppowwrib</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Cadastrando..." : "Criar conta"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/test-login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default TestSignup;
