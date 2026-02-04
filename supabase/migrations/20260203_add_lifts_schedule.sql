alter table public.health_profiles 
add column if not exists lifts jsonb default '{}'::jsonb,
add column if not exists schedule jsonb default '{}'::jsonb;
