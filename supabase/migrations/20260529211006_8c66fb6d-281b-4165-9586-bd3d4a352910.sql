
CREATE TABLE public.device_profiles (
  device_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_profiles TO anon, authenticated;
GRANT ALL ON public.device_profiles TO service_role;

ALTER TABLE public.device_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read profiles" ON public.device_profiles FOR SELECT USING (true);
CREATE POLICY "anyone can insert profiles" ON public.device_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update profiles" ON public.device_profiles FOR UPDATE USING (true) WITH CHECK (true);

CREATE TABLE public.device_states (
  device_id TEXT NOT NULL,
  device_key TEXT NOT NULL,
  is_on BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (device_id, device_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_states TO anon, authenticated;
GRANT ALL ON public.device_states TO service_role;

ALTER TABLE public.device_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read states" ON public.device_states FOR SELECT USING (true);
CREATE POLICY "anyone can insert states" ON public.device_states FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update states" ON public.device_states FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anyone can delete states" ON public.device_states FOR DELETE USING (true);
