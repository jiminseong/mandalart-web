import { createClient } from "@/utils/supabase/server";
import WorkoutSession from "./WorkoutSession";

export default async function WorkoutLogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch all exercises
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

  return <WorkoutSession exercisesList={exercises || []} locale={locale} />;
}
