import { useState } from "react";

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

/** Stub — no backend connected. */
export const useTestProfile = () => {
  const [profile] = useState<TestProfile | null>(null);

  const isFree = true;

  const markFirstLoginSeen = async () => {
    // TODO: implement with new backend
  };

  const refetch = async () => {
    // TODO: implement with new backend
  };

  return { profile, loading: false, isFree, markFirstLoginSeen, refetch };
};
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
