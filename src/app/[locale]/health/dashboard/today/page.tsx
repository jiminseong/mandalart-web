import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import NutritionSection from "./NutritionSection";
import CommonHeader from "@/components/CommonHeader";
import { getTranslations } from "next-intl/server";

export default async function TodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "health.dashboard" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user info
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user?.id)
    .single();

  // KST Date for DB Query
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstGap = 9 * 60 * 60 * 1000;
  const todayKst = new Date(utc + kstGap);

  const dateString = todayKst.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const todayIso = todayKst.toISOString().split("T")[0];

  // Fetch Today's Nutrition Log
  const { data: nutritionLog } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("user_id", user?.id)
    .eq("date", todayIso)
    .single();

  return (
    <div className="min-h-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* iOS Large Title Header with Settings */}
      <CommonHeader
        subTitle={dateString}
        currentOS="Health"
        locale={locale}
        nickname={profile?.nickname || "User"}
        settingsPath={`/${locale}/settings`}
      />

      {/* Main Action Card (iOS Widget Style) */}
      <div className="relative overflow-hidden rounded-[22px] bg-white dark:bg-[#1C1C1E] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-6">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86l-1.43-1.43L22 16.29l-1.43-1.43L19.14 16.29z" />
          </svg>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <h2 className="text-[22px] font-bold text-black dark:text-white">
              {t("workoutGuide")}
            </h2>
            <p
              className="text-[17px] leading-relaxed text-gray-500 dark:text-gray-400 mt-1"
              dangerouslySetInnerHTML={{
                __html: (t.raw("recoveryGood") as string).replace("{rpe}", "8"),
              }}
            />
          </div>

          <div className="pt-2">
            <Link
              href={`/${locale}/health/workout/log`}
              className="w-full h-[50px] bg-black dark:bg-white text-white dark:text-black rounded-[14px] font-semibold text-[17px] shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
            >
              {t("startWorkout")}
            </Link>
          </div>
        </div>
      </div>

      <NutritionSection initialLog={nutritionLog} date={todayIso} locale={locale} />

      {/* Secondary Section */}
      <div className="space-y-4 px-1">
        <h3 className="text-[20px] font-bold text-black dark:text-white">{t("pastRecords")}</h3>
        <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[20px] p-5 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-semibold text-gray-500">{t("thisWeekWorkout")}</div>
            <div className="text-[28px] font-bold text-black dark:text-white">
              {t("count", { count: 0 })}
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
            📊
          </div>
        </div>
      </div>
    </div>
  );
}
