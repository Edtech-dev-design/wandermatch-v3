CREATE TABLE IF NOT EXISTS public.wm_worker_state (
    singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    state JSONB NOT NULL DEFAULT '{"bookings":[],"payments":[],"refunds":[],"feedback":[],"users":{}}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.wm_worker_state (singleton)
VALUES (TRUE)
ON CONFLICT (singleton) DO NOTHING;

ALTER TABLE public.wm_worker_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.wm_worker_state FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.wm_worker_state TO service_role;
