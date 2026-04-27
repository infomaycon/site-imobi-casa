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

export const useSubscriberAccess = () => {
  const { user } = useAuth();

  const { data: subscriber, isLoading } = useQuery({
    queryKey: ["subscriber-access", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as SubscriberData;

      return null;
    },
    enabled: !!user?.email,
  });

  const isAuthorized = !!subscriber;
  const isActive = subscriber?.status === "active";
  const plan = subscriber?.plan || null;
  const isPremium = plan === "premium";

  return {
    subscriber,
    isLoading,
    isAuthorized,
    isActive,
    plan,
    isPremium,
  };
};
