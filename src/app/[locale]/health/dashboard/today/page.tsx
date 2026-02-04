import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function TodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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

  const today = new Date();
  const dateString = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-full space-y-8 animate-in fade-in duration-700">
      {/* iOS Large Title Header */}
      <section className="pt-2 px-1">
        <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {dateString}
        </span>
        <div className="flex items-end justify-between mt-1">
          <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
            투데이
          </h1>
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-1">
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
              {profile?.nickname?.[0] || "U"}
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Card (iOS Widget Style) */}
      <div className="relative overflow-hidden rounded-[22px] bg-white dark:bg-[#1C1C1E] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-6">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86l-1.43-1.43L22 16.29l-1.43-1.43L19.14 16.29z" />
          </svg>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <h2 className="text-[22px] font-bold text-black dark:text-white">오늘의 운동 가이드</h2>
            <p className="text-[17px] leading-relaxed text-gray-500 dark:text-gray-400 mt-1">
              충분한 휴식으로 회복 상태가 좋습니다.
              <br />
              오늘의 추천 강도는 <strong>RPE 8</strong>입니다.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/${locale}/health/workout/log`}
              className="w-full h-[50px] bg-black dark:bg-white text-white dark:text-black rounded-[14px] font-semibold text-[17px] shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
            >
              오늘의 운동 시작하기
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="space-y-4 px-1">
        <h3 className="text-[20px] font-bold text-black dark:text-white">지난 기록</h3>
        <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[20px] p-5 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-semibold text-gray-500">이번 주 운동</div>
            <div className="text-[28px] font-bold text-black dark:text-white">0회</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
            📊
          </div>
        </div>
      </div>
    </div>
  );
}
