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
