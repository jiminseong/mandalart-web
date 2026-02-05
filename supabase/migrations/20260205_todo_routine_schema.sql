-- Create routines table
create table if not exists public.routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category_id uuid references public.todo_categories(id) on delete set null,
  frequency text not null, -- 'daily', 'weekly'
  days text[] default null, -- ['Mon', 'Tue', ...] or ['1', '2'...]
  created_at timestamptz default now() not null
);

-- Add columns to todos for routine tracking
alter table public.todos add column if not exists routine_id uuid references public.routines(id) on delete set null;
alter table public.todos add column if not exists routine_date date;

-- Enable RLS for routines
alter table public.routines enable row level security;

-- Policies for routines
drop policy if exists "Users can manage own routines" on public.routines;

create policy "Users can select own routines" on public.routines for select using (auth.uid() = user_id);
create policy "Users can insert own routines" on public.routines for insert with check (auth.uid() = user_id);
create policy "Users can update own routines" on public.routines for update using (auth.uid() = user_id);
create policy "Users can delete own routines" on public.routines for delete using (auth.uid() = user_id);
