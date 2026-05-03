import { supabase } from "@/integrations/supabase/client";

// Mantém compatibilidade com telas antigas, mas usa somente o backend ativo do projeto.
export const testSupabase = supabase;
