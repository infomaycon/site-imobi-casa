import { useEffect, useState, useCallback } from "react";
import { testSupabase } from "@/lib/supabase";

export interface TestProfile {
  id: string;
  email: string | null;
  plano: string | null;
  status: string | null;
  trial: boolean | null;
  trial_start: string | null;
  trial_end: string | null;
  first_login: boolean | null;
}

/**
 * Lê o profile do usuário autenticado no backend ativo do projeto.
 * Usado pelo painel /admin para gating de plano (free vs pago) e
 * mensagem de boas-vindas no primeiro login.
 */
export const useTestProfile = () => {
  const [profile, setProfile] = useState<TestProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: sessionData } = await testSupabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await testSupabase
      .from("profiles" as any)
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    setProfile((data as any) ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
    const { data: sub } = testSupabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const markFirstLoginSeen = useCallback(async () => {
    if (!profile) return;
    await testSupabase
      .from("profiles" as any)
      .update({ first_login: false })
      .eq("id", profile.id);
    setProfile({ ...profile, first_login: false });
  }, [profile]);

  const isFree = !profile?.plano || profile.plano === "free";

  return { profile, loading, isFree, markFirstLoginSeen, refetch: fetchProfile };
};
