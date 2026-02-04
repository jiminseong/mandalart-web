-- Create Exercises Table
create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  target_part text not null, -- 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'
  category text, -- 'Barbell', 'Dumbbell', 'Machine', 'Bodyweight'
  is_custom boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.exercises enable row level security;

-- Policy: Everyone (Authenticated) can read standard exercises
create policy "Authenticated users can view standard exercises" on public.exercises 
  for select using (auth.role() = 'authenticated');

-- Seed Data (Korean)
insert into public.exercises (name, target_part, category) values
-- Chest
('벤치프레스', 'Chest', 'Barbell'),
('인클라인 벤치프레스', 'Chest', 'Barbell'),
('덤벨 프레스', 'Chest', 'Dumbbell'),
('덤벨 플라이', 'Chest', 'Dumbbell'),
('푸쉬업', 'Chest', 'Bodyweight'),
('딥스', 'Chest', 'Bodyweight'),
('체스트 프레스 머신', 'Chest', 'Machine'),
('펙덱 플라이', 'Chest', 'Machine'),

-- Back
('데드리프트', 'Back', 'Barbell'),
('랫 풀 다운', 'Back', 'Machine'),
('풀업 (턱걸이)', 'Back', 'Bodyweight'),
('바벨 로우', 'Back', 'Barbell'),
('시티드 로우', 'Back', 'Machine'),
('원암 덤벨 로우', 'Back', 'Dumbbell'),
('백 익스텐션', 'Back', 'Bodyweight'),

-- Legs
('스쿼트', 'Legs', 'Barbell'),
('레그 프레스', 'Legs', 'Machine'),
('런지', 'Legs', 'Bodyweight'),
('레그 익스텐션', 'Legs', 'Machine'),
('레그 컬', 'Legs', 'Machine'),
('카프 레이즈', 'Legs', 'Machine'),
('핵 스쿼트', 'Legs', 'Machine'),

-- Shoulders
('오버헤드 프레스', 'Shoulders', 'Barbell'),
('덤벨 숄더 프레스', 'Shoulders', 'Dumbbell'),
('사이드 레터럴 레이즈', 'Shoulders', 'Dumbbell'),
('페이스 풀', 'Shoulders', 'Machine'),
('프론트 레이즈', 'Shoulders', 'Dumbbell'),

-- Arms
('바벨 컬', 'Arms', 'Barbell'),
('덤벨 컬', 'Arms', 'Dumbbell'),
('해머 컬', 'Arms', 'Dumbbell'),
('트라이셉스 익스텐션', 'Arms', 'Machine'),
('스컬 크러셔', 'Arms', 'Barbell'),
('케이블 푸쉬 다운', 'Arms', 'Machine'),

-- Abs / Core
('플랭크', 'Abs', 'Bodyweight'),
('크런치', 'Abs', 'Bodyweight'),
('레그 레이즈', 'Abs', 'Bodyweight'),
('행잉 레그 레이즈', 'Abs', 'Bodyweight'),

-- Cardio
('러닝머신', 'Cardio', 'Machine'),
('실내 자전거', 'Cardio', 'Machine'),
('천국의 계단', 'Cardio', 'Machine');
