
-- Add missing columns to perfis
ALTER TABLE public.perfis 
  ADD COLUMN IF NOT EXISTS plano text NOT NULL DEFAULT 'gratuito',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ativo',
  ADD COLUMN IF NOT EXISTS primeiro_login boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ciclo text NOT NULL DEFAULT 'mensal';

-- Create trigger function to auto-insert perfil on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_perfil()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (user_id, email, plano, status, primeiro_login, ciclo)
  VALUES (NEW.id, NEW.email, 'gratuito', 'ativo', true, 'mensal')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Add unique constraint on user_id to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'perfis_user_id_unique'
  ) THEN
    ALTER TABLE public.perfis ADD CONSTRAINT perfis_user_id_unique UNIQUE (user_id);
  END IF;
END;
$$;

-- Create trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_perfil();
