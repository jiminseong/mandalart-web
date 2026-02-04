-- 1. Programs Table
create type program_status as enum ('active', 'completed', 'archived');

create table public.programs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  total_weeks integer not null,
  start_date date not null,
  end_date date,
  status program_status default 'active' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Program Weeks
create type week_type as enum ('load', 'deload', 'test', 'intro');

create table public.program_weeks (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs(id) on delete cascade not null,
  week_order integer not null,
  week_type week_type default 'load' not null,
  focus_note text
);

-- 3. Program Days
create table public.program_days (
  id uuid default gen_random_uuid() primary key,
  program_week_id uuid references public.program_weeks(id) on delete cascade not null,
  day_order integer not null, -- 1 to 7
  name text,
  target_body_parts text[] -- e.g. ['Legs', 'Abs']
);

-- 4. Program Exercises (Template)
create table public.program_exercises (
  id uuid default gen_random_uuid() primary key,
  program_day_id uuid references public.program_days(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete restrict not null,
  order_index integer not null,
  target_sets integer not null,
  min_reps integer,
  max_reps integer,
  target_rpe numeric,
  rest_seconds integer,
  notes text
);

-- 5. Modify Workouts Table (Add link to template)
create type workout_status as enum ('planned', 'in_progress', 'completed');

-- Using DO block to avoid errors if types/columns already exist (idempotency check)
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'workout_status') then
        create type workout_status as enum ('planned', 'in_progress', 'completed');
    end if;
end $$;

alter table public.workouts 
  add column if not exists program_day_id uuid references public.program_days(id) on delete set null,
  add column if not exists status workout_status default 'planned',
  add column if not exists fatigue_level integer; -- 1 to 10

-- 6. Workout Logs (Actual Exercise Log - Normalized)
create table public.workout_logs (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete restrict not null,
  order_index integer not null,
  is_substituted boolean default false,
  original_exercise_id uuid references public.exercises(id) on delete set null -- If substituted
);

-- 7. Workout Sets (Actual Set Log - Normalized)
create table public.workout_sets (
  id uuid default gen_random_uuid() primary key,
  workout_log_id uuid references public.workout_logs(id) on delete cascade not null,
  set_order integer not null,
  weight numeric,
  reps integer,
  rpe numeric,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.programs enable row level security;
alter table public.program_weeks enable row level security;
alter table public.program_days enable row level security;
alter table public.program_exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.workout_sets enable row level security;

-- Programs Policies
create policy "Users can manage own programs" on public.programs
  using (auth.uid() = user_id);

-- Structure tables Policies (Read Only for Client, Write via Server Action/Admin)
-- Assuming Server Actions bypass RLS or Auth User owns the program

create policy "Users can view weeks of their programs" on public.program_weeks
  for select using (
    exists (
      select 1 from public.programs p 
      where p.id = program_weeks.program_id 
      and p.user_id = auth.uid()
    )
  );

create policy "Users can view days of their programs" on public.program_days
  for select using (
    exists (
      select 1 from public.program_weeks pw
      join public.programs p on p.id = pw.program_id
      where pw.id = program_days.program_week_id
      and p.user_id = auth.uid()
    )
  );
  
 create policy "Users can view exercises of their programs" on public.program_exercises
  for select using (
    exists (
      select 1 from public.program_days pd
      join public.program_weeks pw on pw.id = pd.program_week_id
      join public.programs p on p.id = pw.program_id
      where pd.id = program_exercises.program_day_id
      and p.user_id = auth.uid()
    )
  );

-- Workout Logs & Sets Policies
-- Workouts already has userId and RLS.
create policy "Users can manage own workout logs" on public.workout_logs
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_logs.workout_id
      and w.user_id = auth.uid()
    )
  );

create policy "Users can manage own workout sets" on public.workout_sets
  using (
    exists (
      select 1 from public.workout_logs wl
      join public.workouts w on w.id = wl.workout_id
      where wl.id = workout_sets.workout_log_id
      and w.user_id = auth.uid()
    )
  );
