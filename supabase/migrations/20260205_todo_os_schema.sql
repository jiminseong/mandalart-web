-- Create todo_categories table
create table public.todo_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color_class text not null,
  created_at timestamptz default now() not null
);

-- Create todos table
create table public.todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.todo_categories(id) on delete set null,
  title text not null,
  status text not null check (status in ('todo', 'done')),
  created_at timestamptz default now() not null,
  completed_at timestamptz,
  time text,
  "order" double precision default 0 -- For ordering within stack if needed
);

-- Enable RLS
alter table public.todo_categories enable row level security;
alter table public.todos enable row level security;

-- Policies for todo_categories
create policy "Users can view own categories" on public.todo_categories
  for select using (auth.uid() = user_id);

create policy "Users can insert own categories" on public.todo_categories
  for insert with check (auth.uid() = user_id);

create policy "Users can update own categories" on public.todo_categories
  for update using (auth.uid() = user_id);

create policy "Users can delete own categories" on public.todo_categories
  for delete using (auth.uid() = user_id);

-- Policies for todos
create policy "Users can view own todos" on public.todos
  for select using (auth.uid() = user_id);

create policy "Users can insert own todos" on public.todos
  for insert with check (auth.uid() = user_id);

create policy "Users can update own todos" on public.todos
  for update using (auth.uid() = user_id);

create policy "Users can delete own todos" on public.todos
  for delete using (auth.uid() = user_id);
