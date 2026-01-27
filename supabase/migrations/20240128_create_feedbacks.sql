-- Create a table for storing user feedback
create table public.feedbacks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Interest Rating (1-5)
  rating integer, 
  
  -- Detailed Questions
  feature_removals text, -- 가장 사라졌으면 하는 기능
  feature_additions text, -- 가장 있었으면 하는 기능
  feature_keep text, -- 가장 잘쓰고 있는 기능
  reason_not_using text, -- 투두앱을 사용하지 않는 이유
  reason_using text, -- 투두앱을 사용하는 이유

  -- Contact
  contact_info text -- 이메일 또는 카카오 ID
);

-- Enable RLS
alter table public.feedbacks enable row level security;

-- Allow anyone to insert feedback
create policy "Enable insert for everyone" on public.feedbacks
  for insert with check (true);
