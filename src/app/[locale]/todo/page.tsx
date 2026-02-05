import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { getTodosAndCategories } from "./actions";
import TodoBoard from "./components/TodoBoard";
import CommonHeader from "@/components/CommonHeader";

export default async function TodoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "todo.stack" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile for nickname
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user?.id)
    .single();

  const { todos, categories } = await getTodosAndCategories(locale);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black px-4 pt-2">
      <CommonHeader
        subTitle={t("productivity")}
        currentOS="Todo"
        locale={locale}
        nickname={profile?.nickname}
        settingsPath={`/${locale}/health/settings`}
      />
      <TodoBoard initialTodos={todos} initialCategories={categories} locale={locale} />
    </div>
  );
}
