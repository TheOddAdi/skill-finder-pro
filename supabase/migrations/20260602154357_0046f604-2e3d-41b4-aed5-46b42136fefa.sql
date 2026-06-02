
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  rank TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  resume_file_url TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Prototype: open access (no auth in this app)
CREATE POLICY "Anyone can view employees"
  ON public.employees FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert employees"
  ON public.employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update employees"
  ON public.employees FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete employees"
  ON public.employees FOR DELETE
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER employees_set_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX employees_skills_gin ON public.employees USING GIN (skills);
