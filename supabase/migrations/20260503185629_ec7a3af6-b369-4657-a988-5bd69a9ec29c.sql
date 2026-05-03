CREATE OR REPLACE FUNCTION public.handle_new_user_perfil()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  normalized_email text;
  profile_name text;
BEGIN
  normalized_email := lower(NEW.email);
  profile_name := split_part(normalized_email, '@', 1);

  INSERT INTO public.perfis (user_id, email, nome, plano, status, primeiro_login, ciclo)
  VALUES (NEW.id, normalized_email, profile_name, 'gratuito', 'ativo', true, 'mensal')
  ON CONFLICT (user_id) DO UPDATE SET
    email = COALESCE(public.perfis.email, EXCLUDED.email),
    nome = COALESCE(public.perfis.nome, EXCLUDED.nome),
    plano = COALESCE(public.perfis.plano, EXCLUDED.plano),
    status = COALESCE(public.perfis.status, EXCLUDED.status),
    primeiro_login = COALESCE(public.perfis.primeiro_login, EXCLUDED.primeiro_login),
    ciclo = COALESCE(public.perfis.ciclo, EXCLUDED.ciclo),
    updated_at = now();

  INSERT INTO public.subscribers (email, name, plan, plan_value, status, trial, trial_end)
  VALUES (normalized_email, profile_name, 'trial', 0, 'active', true, now() + interval '7 days')
  ON CONFLICT (email) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_perfil ON auth.users;

CREATE TRIGGER on_auth_user_created_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_perfil();

REVOKE ALL ON FUNCTION public.handle_new_user_perfil() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user_perfil() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user_perfil() FROM authenticated;