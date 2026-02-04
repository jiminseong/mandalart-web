import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import HealthPageHeader from "@/components/HealthPageHeader";

export default async function WorkoutHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "health.history" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user?.id)
    .single();

  const nickname = profile?.nickname || "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 pt-2">
      <div className="space-y-1">
        <HealthPageHeader
          subtitle="HISTORY"
          title={t("title")}
          nickname={nickname}
          locale={locale}
        />
        <p className="text-[17px] text-gray-500 dark:text-gray-400 px-1 pb-4 border-b border-gray-100 dark:border-gray-800">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl">
          📝
        </div>
        <div className="space-y-1">
          <h3 className="text-[20px] font-semibold text-black dark:text-white">
            {t("emptyTitle")}
          </h3>
          <p className="text-[15px] text-gray-500 max-w-[200px] mx-auto">{t("emptyDescription")}</p>
        </div>
      </div>
    </div>
  );
}
