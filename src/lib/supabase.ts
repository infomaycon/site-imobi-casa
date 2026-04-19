import { createClient } from "@supabase/supabase-js";

// Cliente Supabase EXTERNO (projeto separado para testes).
// NÃO confundir com src/integrations/supabase/client.ts (Lovable Cloud principal).
const SUPABASE_URL = "https://conuhvxiiwdsppowwrib.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_v-L3eEdcToMoRIVKVCR9nQ_h0WWNkpk";

export const testSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    storageKey: "test-supabase-auth",
    persistSession: true,
    autoRefreshToken: true,
  },
});
