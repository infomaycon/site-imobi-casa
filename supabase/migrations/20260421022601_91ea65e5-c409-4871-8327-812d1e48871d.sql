-- Adicionar campos de trial à tabela subscribers
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS trial boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_end timestamptz;

-- Permitir que o próprio usuário autenticado crie seu registro de assinante (usado para iniciar o trial de 7 dias no primeiro login)
CREATE POLICY "Users can create own subscriber row"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (email = (auth.jwt() ->> 'email'));