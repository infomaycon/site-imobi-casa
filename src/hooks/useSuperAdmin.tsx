import { useAuth } from "@/hooks/useAuth";

export type AppRole = "owner" | "admin" | "user";

/** Stub — no backend connected. */
export const useSuperAdmin = () => {
  const { user } = useAuth();

  return {
    userRole: null as AppRole | null,
    isOwner: false,
    isAdmin: false,
    hasSuperAccess: false,
    roleLoading: false,
  };
};
