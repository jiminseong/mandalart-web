import { createClient } from "@/utils/supabase/server";
import WorkoutSession from "./WorkoutSession";

export default async function WorkoutLogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  // 1. Get current date in KST
  const kstOffset = 9 * 60 * 60 * 1000;
  const nowKst = new Date(Date.now() + kstOffset);
  const dayOfWeek = nowKst.getUTCDay(); // 0-6 (Sun-Sat) in KST

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

  if (program && program.current_week && program.current_week.length > 0) {
    const weeks = program.current_week;
    const targetDbDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    for (const week of weeks) {
      const dayMatch = week.days.find((d: any) => d.day_order === targetDbDay);

      if (dayMatch) {
        todaysRoutine = dayMatch;
        break;
      }
    }
  }

  // 4. Fetch all exercises for search
  const { data: allExercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

  // 5. Localization Logic
  // Helper to get localized name
  const getName = (ex: any) => {
    if (locale === "en" && ex.name_en) return ex.name_en;
    return ex.name;
  };

  // Localize All Exercises List
  const localizedAllExercises =
    allExercises?.map((e: any) => ({
      ...e,
      name: getName(e),
    })) || [];

  // Localize Today's Routine
  let localizedRoutine = null;
  if (todaysRoutine) {
    localizedRoutine = {
      ...todaysRoutine,
      exercises: todaysRoutine.exercises.map((ex: any) => ({
        ...ex,
        exercise_details: {
          ...ex.exercise_details,
          name: getName(ex.exercise_details),
        },
      })),
    };
  }

  return (
    <WorkoutSession
      exercisesList={localizedAllExercises}
      initialRoutine={localizedRoutine}
      locale={locale}
    />
  );
}
