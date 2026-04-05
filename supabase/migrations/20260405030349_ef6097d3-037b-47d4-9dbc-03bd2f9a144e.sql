
-- Drop the problematic policy that references auth.users table directly
DROP POLICY IF EXISTS "Subscribers can view own record by email" ON public.subscribers;

-- Recreate the policy using auth.jwt() which doesn't require access to auth.users
CREATE POLICY "Subscribers can view own record by email"
ON public.subscribers
FOR SELECT
TO authenticated
USING (email = (auth.jwt()->>'email')::text);
