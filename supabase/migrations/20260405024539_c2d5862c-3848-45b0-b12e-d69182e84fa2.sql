CREATE POLICY "Subscribers can view own record by email"
ON public.subscribers
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));