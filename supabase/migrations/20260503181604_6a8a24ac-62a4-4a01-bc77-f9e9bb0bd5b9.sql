
CREATE TABLE public.perfis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  subdominio text UNIQUE,
  dominio_custom text UNIQUE,
  nome text,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Anyone can read perfis (needed for subdomain lookup without auth)
CREATE POLICY "Public can read perfis" ON public.perfis FOR SELECT USING (true);

-- Authenticated users can manage their own perfis
CREATE POLICY "Users can insert own perfil" ON public.perfis FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own perfil" ON public.perfis FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own perfil" ON public.perfis FOR DELETE TO authenticated USING (auth.uid() = user_id);
