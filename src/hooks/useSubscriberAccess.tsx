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
    hasPerfil: false,
    isAuthorized: false,
    isActive: false,
    isLoading: false,
    plan: null as string | null,
    isPremium: false,
  };
};
