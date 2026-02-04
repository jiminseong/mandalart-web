"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateNickname(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const nickname = formData.get("nickname") as string;
  const locale = (formData.get("locale") as string) || "ko";

  if (!nickname) {
    return { error: "닉네임을 입력해주세요." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email, nickname: nickname });

  if (error) {
    console.error("Error updating nickname:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  redirect(`/${locale}/health/onboarding/profile`);
}

export async function updateProfile(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const locale = (formData.get("locale") as string) || "ko";

  const height = parseFloat(formData.get("height") as string) || 0;
  const sleepAvg = parseFloat(formData.get("sleep_avg") as string) || 0;
  const workoutPerWeek = parseInt(formData.get("workout_per_week") as string) || 0;
  const injuryNotes = formData.get("injury_notes") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { error } = await supabase.from("health_profiles").upsert({
    user_id: user.id,
    height,
    sleep_avg: sleepAvg,
    workout_per_week: workoutPerWeek,
    injury_notes: injuryNotes,
  });

  if (error) {
    console.error("Error updating profile:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  redirect(`/${locale}/health/onboarding/baseline/lifts`);
}

export async function updateLifts(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const locale = (formData.get("locale") as string) || "ko";

  const squat = parseFloat(formData.get("squat") as string) || 0;
  const bench = parseFloat(formData.get("bench") as string) || 0;
  const deadlift = parseFloat(formData.get("deadlift") as string) || 0;
  const overhead = parseFloat(formData.get("overhead") as string) || 0;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const lifts = { squat, bench, deadlift, overhead };

  const { error } = await supabase
    .from("health_profiles")
    .update({ lifts }) // Assuming column added
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating lifts:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  redirect(`/${locale}/health/onboarding/baseline/inbody`);
}

export async function updateInbody(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const locale = (formData.get("locale") as string) || "ko";

  const weight = parseFloat(formData.get("weight") as string);
  const muscle = parseFloat(formData.get("skeletal_muscle") as string) || null;
  const fatRate = parseFloat(formData.get("body_fat_rate") as string) || null;

  if (!weight) return { error: "체중은 필수 입력 항목입니다." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { error } = await supabase.from("inbodies").insert({
    user_id: user.id,
    date: new Date().toISOString(),
    weight,
    skeletal_muscle: muscle,
    body_fat_rate: fatRate,
  });

  if (error) {
    console.error("Error updating inbody:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  redirect(`/${locale}/health/onboarding/goal`);
}

export async function createGoal(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const locale = (formData.get("locale") as string) || "ko";

  const type = formData.get("type") as string;
  const targetValue = parseFloat(formData.get("target_value") as string);
  const unit = formData.get("unit") as string;
  const priority = parseInt(formData.get("priority") as string) || 1;
  const dateStr = formData.get("start_date") as string;

  if (!type || !targetValue || !unit) {
    return { error: "모든 필수 항목을 입력해주세요." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    type,
    target_value: targetValue,
    unit,
    priority,
    start_date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
    is_active: true,
  });

  if (error) {
    console.error("Error creating goal:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  const redirectTo =
    (formData.get("redirect_to") as string) || `/${locale}/health/onboarding/schedule`;
  redirect(redirectTo);
}

export async function updateSchedule(previousState: any, formData: FormData) {
  const supabase = await createClient();
  const locale = (formData.get("locale") as string) || "ko";

  // Simple checks for days
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const selectedDays = days.filter((day) => formData.get(`day_${day}`) === "on");
  const timeSlot = formData.get("time_slot") as string; // morning, afternoon, evening

  const schedule = {
    available_days: selectedDays,
    preferred_time: timeSlot,
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { error } = await supabase
    .from("health_profiles")
    .update({ schedule })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating schedule:", error);
    return { error: "저장 중 오류가 발생했습니다." };
  }

  redirect(`/${locale}/health/dashboard/today`);
}
