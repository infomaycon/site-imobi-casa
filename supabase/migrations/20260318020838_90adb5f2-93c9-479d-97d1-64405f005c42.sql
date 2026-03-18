
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS footer_extra_info text DEFAULT NULL;
