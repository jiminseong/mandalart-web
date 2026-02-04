create table if not exists nutrition_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  calories numeric default 0,
  protein numeric default 0,
  supplements jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

alter table nutrition_logs enable row level security;

create policy "Users can view their own nutrition logs"
  on nutrition_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own nutrition logs"
  on nutrition_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own nutrition logs"
  on nutrition_logs for update
  using (auth.uid() = user_id);
