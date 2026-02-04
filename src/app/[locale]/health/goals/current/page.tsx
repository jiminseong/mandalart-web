import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { deleteGoal } from "../../actions";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function GoalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "health.goals" });
  const tCommon = await getTranslations({ locale, namespace: "health.common" });
  const supabase = await createClient();

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Health Profile & Inbody
  const [profileResult, inbodyResult] = await Promise.all([
    supabase.from("health_profiles").select("lifts").eq("user_id", user?.id).single(),
    supabase
      .from("inbodies")
      .select("weight, body_fat_rate")
      .eq("user_id", user?.id)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const profile = profileResult.data;
  const inbody = inbodyResult.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 pt-2">
      <div className="space-y-1 pt-2">
        <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Target
        </span>
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          {t("title")}
        </h1>
      </div>

      <div className="space-y-4">
        {goals && goals.length > 0 ? (
          goals.map((goal) => {
            const targetValue = goal.target_value || 0;
            let currentValue = 0;
            let startValue = 0;

            if (goal.type === "strength") {
              const lifts = profile?.lifts as any;
              if (lifts) {
                currentValue =
                  (Number(lifts.squat) || 0) +
                  (Number(lifts.bench) || 0) +
                  (Number(lifts.deadlift) || 0);
              }
            } else if (goal.type === "weight") {
              currentValue = inbody?.weight || 0;
            } else if (goal.type === "bodyfat") {
              currentValue = inbody?.body_fat_rate || 0;
            }

            const progress =
              targetValue > startValue
                ? Math.min(
                    100,
                    Math.max(0, ((currentValue - startValue) / (targetValue - startValue)) * 100),
                  )
                : 0;

            // Map goal types and descriptions
            let typeTitle = t("types.habit");
            if (goal.type === "strength") typeTitle = t("types.strength");
            else if (goal.type === "weight") typeTitle = t("types.weight");
            else if (goal.type === "bodyfat") typeTitle = t("types.bodyfat");

            let typeDesc = t("descriptions.default");
            if (goal.type === "strength") typeDesc = t("descriptions.strength");

            return (
              <div
                key={goal.id}
                className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[22px] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[17px] font-semibold text-black dark:text-white">
                    {t("activeGoals")}
                  </span>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${locale}/health/onboarding/goal?mode=edit&redirect_to=/${locale}/health/goals/current`}
                      className="text-[15px] leading-none text-[#007AFF] font-medium hover:text-[#007AFF]/80 transition-colors"
                    >
                      {tCommon("edit")}
                    </Link>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                    <form
                      action={deleteGoal.bind(null, goal.id, locale)}
                      className="flex items-center"
                    >
                      <button
                        type="submit"
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                        aria-label={tCommon("delete")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                    {goal.type === "strength"
                      ? "💪"
                      : goal.type === "weight"
                        ? "⚖️"
                        : goal.type === "bodyfat"
                          ? "🔥"
                          : "🏃"}
                  </div>
                  <div>
                    <div className="text-[20px] font-bold text-black dark:text-white">
                      {typeTitle}
                    </div>
                    <div className="text-[15px] text-gray-500">{typeDesc}</div>
                  </div>
                </div>

                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#007AFF]" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[13px] font-medium text-gray-400">
                  <span>
                    {t("current", { value: currentValue })}
                    {goal.unit}
                  </span>
                  <span>
                    {t("target", { value: targetValue })}
                    {goal.unit}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[22px] p-6 text-center text-gray-500">
            {t("empty")}
          </div>
        )}
      </div>
    </div>
  );
}
