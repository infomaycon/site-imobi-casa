import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://uoizwjabwfwrwyuyctrx.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'sb_publishable_cETlAbHQvHwOAu8WL2xdGw_yDWYlEK0';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);
