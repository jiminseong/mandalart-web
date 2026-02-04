-- Create Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  nickname text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Health Profile
create table public.health_profiles (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  height numeric,
  sleep_avg numeric,
  workout_per_week integer,
  injury_notes text,
  preferences text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Goal Type Enum
-- Check if type exists to avoid error on repeated runs if manual intervention
do $$ begin
    create type goal_type as enum ('strength', 'weight', 'habit', 'bodyfat');
exception
    when duplicate_object then null;
end $$;

-- Goals
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type goal_type not null,
  target_value numeric not null,
  unit text not null,
  priority integer not null,
  start_date timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Workouts
create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  exercises jsonb not null default '[]'::jsonb, 
  rpe_avg numeric,
  condition_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inbody
create table public.inbodies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  weight numeric not null,
  skeletal_muscle numeric,
  body_fat_rate numeric,
  score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.health_profiles enable row level security;
alter table public.goals enable row level security;
alter table public.workouts enable row level security;
alter table public.inbodies enable row level security;

-- Profile Policies
create policy "Users can view own profile" on public.profiles 
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles 
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles 
  for insert with check (auth.uid() = id);

-- Health Profile Policies
create policy "Users can view own health profile" on public.health_profiles 
  for select using (auth.uid() = user_id);ㄴ. 

create policy "Users can update own health profile" on public.health_profiles 
  for update using (auth.uid() = user_id);

create policy "Users can insert own health profile" on public.health_profiles 
  for insert with check (auth.uid() = user_id);

-- Goals Policies
create policy "Users can view own goals" on public.goals 
  for select using (auth.uid() = user_id);

create policy "Users can insert own goals" on public.goals 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own goals" on public.goals 
  for update using (auth.uid() = user_id);

-- Workouts Policies
create policy "Users can view own workouts" on public.workouts 
  for select using (auth.uid() = user_id);

create policy "Users can insert own workouts" on public.workouts 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own workouts" on public.workouts 
  for update using (auth.uid() = user_id);

-- Inbody Policies
create policy "Users can view own inbodies" on public.inbodies 
  for select using (auth.uid() = user_id);

create policy "Users can insert own inbodies" on public.inbodies 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own inbodies" on public.inbodies 
  for update using (auth.uid() = user_id);

-- Function to handle new user creation (optional, but good for linking)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname)
  values (new.id, new.email, new.raw_user_meta_data->>'nickname');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
