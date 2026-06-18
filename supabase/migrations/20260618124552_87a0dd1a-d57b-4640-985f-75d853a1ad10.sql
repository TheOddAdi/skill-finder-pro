ALTER TABLE public.employees ADD COLUMN email text;
ALTER TABLE public.employees ADD COLUMN phone text;
UPDATE public.employees SET email = 'placeholder+' || id::text || '@example.com' WHERE email IS NULL;
ALTER TABLE public.employees ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.employees ADD CONSTRAINT employees_email_unique UNIQUE (email);