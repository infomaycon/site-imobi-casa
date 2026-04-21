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

      // Fallback: usuário autenticado sem registro de assinante.
      // Cria automaticamente um trial de 7 dias.
      const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: created } = await supabase
        .from("subscribers")
        .insert({
          email: user.email,
          name: user.email.split("@")[0],
          plan: "trial",
          plan_value: 0,
          status: "active",
          trial: true,
          trial_end: trialEnd,
        })
        .select("*")
        .maybeSingle();
      return (created as SubscriberData | null) ?? null;
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
