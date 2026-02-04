"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveWorkout(workoutData: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // workoutData structure expected:
  // {
  //   date: "YYYY-MM-DD",
  //   startTime: timestamp,
  //   endTime: timestamp,
  //   exercises: [
  //     {
  //       id: "uuid",
  //       name: "Squat",
  //       sets: [{ weight: 100, reps: 5 }, ...]
  //     }
  //   ]
  // }

  const { error } = await supabase.from("workouts").insert({
    user_id: user.id,
    date: new Date().toISOString().split("T")[0],
    exercises: workoutData.exercises,
    condition_note: workoutData.note || "",
    // We could add start/end time columns if needed later
  });

  if (error) {
    console.error("Error saving workout:", error);
    return { error: "운동 저장에 실패했습니다." };
  }

  revalidatePath("/(locale)/health/dashboard/today", "page");
  revalidatePath("/(locale)/health/workout/history", "page");

  return { success: true };
}
