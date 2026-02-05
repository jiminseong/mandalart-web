import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import CommonHeader from "@/components/CommonHeader";
import { getRoutines, getTodosAndCategories } from "../actions";
import RoutineList from "../components/RoutineList";
import { DBRoutine } from "../actions";

export default async function RoutinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "todo.stack" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user?.id)
    .single();

  const routines = await getRoutines(locale);
  const { categories } = await getTodosAndCategories(locale);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black px-4 pt-2">
      <CommonHeader
        subTitle={t("productivity")}
        currentOS="Todo"
        locale={locale}
        nickname={profile?.nickname}
        settingsPath={`/${locale}/settings`}
      />

      <div className="mt-4 flex-1 overflow-hidden">
        <RoutineList routines={routines} categories={categories} locale={locale} />
      </div>
    </div>
  );
}
