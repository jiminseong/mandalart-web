-- Add DELETE policy for workouts table
create policy "Users can delete own workouts" on public.workouts 
  for delete using (auth.uid() = user_id);

-- Add DELETE policy for goals table (for consistency)
create policy "Users can delete own goals" on public.goals 
  for delete using (auth.uid() = user_id);

-- Add DELETE policy for inbodies table (for consistency)
create policy "Users can delete own inbodies" on public.inbodies 
  for delete using (auth.uid() = user_id);
