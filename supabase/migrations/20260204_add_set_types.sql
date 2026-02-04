-- Add set_type to program exercises and workout sets
create type set_type as enum (
  'top_set',        -- 탑세트 (가장 무거운 세트)
  'back_off',       -- 백오프 (탑세트 후 볼륨)
  'working_set',    -- 일반 중량 반복
  'high_rep',       -- 저중량 고반복
  'ramping',        -- 점진 워밍업
  'amrap',          -- 최대 반복
  'tempo'           -- 템포/정지
);

alter table public.program_exercises 
  add column if not exists set_type set_type default 'working_set' not null;

alter table public.workout_sets 
  add column if not exists set_type set_type default 'working_set' not null;

-- Update seed data with set types
-- Use DO block to update specific exercises based on our seed logic
do $$
declare
  v_program_id uuid;
begin
  -- Get the program ID created earlier
  select id into v_program_id from public.programs where name = 'Powerbuilding Phase 1' limit 1;
  
  if v_program_id is not null then
    -- Update Squat, Bench, Deadlift Top Sets (Week 1-3, Order 1)
    update public.program_exercises
    set set_type = 'top_set'
    from public.program_days pd
    join public.program_weeks pw on pw.id = pd.program_week_id
    where program_exercises.program_day_id = pd.id
    and pw.program_id = v_program_id
    and pw.week_order <= 3
    and program_exercises.target_sets = 1
    and program_exercises.notes like '%Main%';
    
    -- Update Accessory Work (OHP, Lunge...)
    update public.program_exercises
    set set_type = 'back_off' -- Or working_set
    from public.program_days pd
    join public.program_weeks pw on pw.id = pd.program_week_id
    where program_exercises.program_day_id = pd.id
    and pw.program_id = v_program_id
    and program_exercises.notes like '%Accessory%';
    
    -- Update Volume Legs
     update public.program_exercises
    set set_type = 'high_rep'
    from public.program_days pd
    join public.program_weeks pw on pw.id = pd.program_week_id
    where program_exercises.program_day_id = pd.id
    and pw.program_id = v_program_id
    and program_exercises.notes like '%Volume Leg%';
    
  end if;
end $$;
