import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WorkoutSession from "../../log/WorkoutSession";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  // Fetch the workout by ID
  const { data: workout, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !workout) {
    redirect(`/${locale}/health/workout/history`);
  }

  // Fetch all exercises for search
  const { data: allExercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

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

  return (
    <WorkoutSession
      exercisesList={localizedAllExercises}
      initialRoutine={null}
      locale={locale}
      existingWorkout={workout}
      workoutId={id}
    />
  );
}
