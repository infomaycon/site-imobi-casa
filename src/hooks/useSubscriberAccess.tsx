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

/** Stub — no backend connected. */
export const useSubscriberAccess = () => {
  const { user } = useAuth();

  return {
    subscriber: null as SubscriberData | null,
    isAuthorized: false,
    isActive: false,
    isLoading: false,
  };
};
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
