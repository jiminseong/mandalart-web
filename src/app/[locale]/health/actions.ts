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

export async function deleteGoal(goalId: string, locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("goals")
    .update({ is_active: false })
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting goal:", error);
    throw new Error("Failed to delete goal");
  }

  revalidatePath(`/${locale}/health/goals/current`);
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

export async function saveNutritionLog(
  date: string,
  data: {
    calories?: number;
    protein?: number;
    supplements?: any;
  },
  locale: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // First, try to fetch existing log to merge supplements if needed,
  // but for simplicity, we might assume the UI sends the full state or we implement specific patch logic.
  // Here we use upsert. If we want partial updates, we might need a distinct logic.
  // For a "checklist", usually we toggle one item.
  // Let's assume the UI sends the *full* supplements object or we merge it here.
  // Actually, to be safe and atomic, let's fetch current first if supplements is being updated.

  // Implementation Strategy:
  // 1. If calories/protein provided, update them.
  // 2. If supplements provided, merge with existing.

  const { data: existing } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  const updates: any = {
    user_id: user.id,
    date: date,
    updated_at: new Date().toISOString(),
  };

  if (data.calories !== undefined) updates.calories = data.calories;
  if (data.protein !== undefined) updates.protein = data.protein;

  if (data.supplements) {
    // Merge existing supplements with new ones
    const currentSupplements = existing?.supplements || {};
    updates.supplements = { ...currentSupplements, ...data.supplements };
  }

  // If existing record found, use its ID? No, upsert using unique key (user_id, date) is cleaner if configured.
  // But our migration defines unique(user_id, date), so upsert works.
  // However, we need to be careful not to overwrite valid data with defaults if valid data wasn't passed.
  // But we are constructing `updates` based on passed data.
  // For columns like calories/protein, strict update.

  // If no existing record, we need to initialize others to 0 or null if not provided?
  // Table defaults are 0.

  const { error } = await supabase
    .from("nutrition_logs")
    .upsert(updates, { onConflict: "user_id, date" });

  if (error) {
    console.error("Error saving nutrition log:", error);
    throw new Error("Failed to save nutrition log");
  }

  revalidatePath(`/${locale}/health/dashboard/today`);
}
