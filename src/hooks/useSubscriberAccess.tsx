import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface SubscriberData {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  plan_value: number;
  created_at: string;
  trial?: boolean;
  trial_end?: string | null;
}

interface AccessData {
  subscriber: SubscriberData | null;
  hasPerfil: boolean;
}

export const useSubscriberAccess = () => {
  const { user } = useAuth();

  const { data: access, isLoading } = useQuery({
    queryKey: ["subscriber-access", user?.id, user?.email],
    queryFn: async () => {
      if (!user?.id || !user?.email) return { subscriber: null, hasPerfil: false } as AccessData;
      const [subscriberResult, perfilResult] = await Promise.all([
        supabase
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
          .maybeSingle(),
        supabase
          .from("perfis")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (subscriberResult.error) throw subscriberResult.error;
      if (perfilResult.error) throw perfilResult.error;

      return {
        subscriber: (subscriberResult.data as SubscriberData | null) ?? null,
        hasPerfil: !!perfilResult.data,
      } as AccessData;
    },
    enabled: !!user?.id && !!user?.email,
  });

  const subscriber = access?.subscriber ?? null;
  const hasPerfil = access?.hasPerfil ?? false;
  const isAuthorized = !!subscriber && hasPerfil;
  const isActive = subscriber?.status === "active";
  const plan = subscriber?.plan || null;
  const isPremium = plan === "premium";

  return {
    subscriber,
    hasPerfil,
    isLoading,
    isAuthorized,
    isActive,
    plan,
    isPremium,
  };
};
