import { createClient } from "@/utils/supabase/server";
import WorkoutSession from "./WorkoutSession";

export default async function WorkoutLogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  // 1. Get current date in KST, then format as YYYY-MM-DD
  // Since server might be UTC, we offset by 9 hours manually for checking "Today" in Korea
  const kstOffset = 9 * 60 * 60 * 1000;
  const nowKst = new Date(Date.now() + kstOffset);
  const dayOfWeek = nowKst.getUTCDay(); // 0-6 (Sun-Sat) in KST context if we treat it as UTC date object
  // Actually, getUTCDay() on a shifted date object gives the correct day index for KST

  // 2. Fetch Active Program and Schedule
  const { data: program } = await supabase
    .from("programs")
    .select(
      `
      id,
      current_week: program_weeks(
        id, week_order, week_type,
        days: program_days(
          id, day_order, name,
          exercises: program_exercises(
            order_index, target_sets, min_reps, max_reps, target_rpe, notes, set_type,
            exercise_details: exercises(*)
          )
        )
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 3. Find today's routine
  let todaysRoutine = null;
  // We assume the program starts from week 1.
  // For MVP, we just pick the FIRST week's matching day to show something.

  if (program && program.current_week && program.current_week.length > 0) {
    const weeks = program.current_week;
    // Convert JS day (0=Sun, 1=Mon... 6=Sat) to DB day_order (1=Mon... 7=Sun)
    // JS Wednesday(3) -> DB Wednesday(3)
    // JS Sunday(0) -> DB Sunday(7)
    const targetDbDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    console.log(
      `[WorkoutLog] Date: ${nowKst.toISOString()}, DayOfWeek(JS): ${dayOfWeek}, TargetDB: ${targetDbDay}`,
    );

    for (const week of weeks) {
      const dayMatch = week.days.find((d: any) => d.day_order === targetDbDay);

      if (dayMatch) {
        todaysRoutine = dayMatch;
        console.log(`[WorkoutLog] Found match: ${dayMatch.name}`);
        break;
      }
    }
  }

  // 4. Fetch all exercises for search
  const { data: allExercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

  return (
    <WorkoutSession
      exercisesList={allExercises || []}
      initialRoutine={todaysRoutine}
      locale={locale}
    />
  );
}
