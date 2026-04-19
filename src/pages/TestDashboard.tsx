import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { testSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  email: string;
  plano: string;
  status: string;
  trial: boolean;
  trial_start: string;
  trial_end: string;
}

const TestDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = testSupabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    testSupabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/test-login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await testSupabase
        .from("profiles" as any)
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        setProfileError(error.message);
        return;
      }
      setProfile(data as unknown as Profile);
    })();
  }, [user]);

  const handleLogout = async () => {
    await testSupabase.auth.signOut();
    navigate("/test-login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg p-8 space-y-6 border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard (Teste)</h1>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Conectado ao Supabase externo</p>
          <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Profile</h2>
          {profileError && <p className="text-sm text-destructive">{profileError}</p>}
          {!profile && !profileError && <p className="text-sm text-muted-foreground">Carregando profile...</p>}
          {profile && (
            <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
              <p><strong>Plano:</strong> {profile.plano}</p>
              <p><strong>Status:</strong> {profile.status}</p>
              <p><strong>Trial:</strong> {profile.trial ? "Sim" : "Não"}</p>
              <p><strong>Trial início:</strong> {new Date(profile.trial_start).toLocaleString("pt-BR")}</p>
              <p><strong>Trial fim:</strong> {new Date(profile.trial_end).toLocaleString("pt-BR")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
