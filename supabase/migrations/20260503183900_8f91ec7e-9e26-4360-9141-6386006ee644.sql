
-- Revoke public/anon execute on security definer functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user_perfil() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
