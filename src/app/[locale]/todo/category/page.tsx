import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { getTodosAndCategories } from "../actions";
import CategoryList from "../components/CategoryList";
import CommonHeader from "@/components/CommonHeader";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "todo.categoryManager" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user?.id)
    .single();

  const { categories } = await getTodosAndCategories(locale);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black px-4 pt-2">
      <CommonHeader
        subTitle={t("title")}
        currentOS="Todo"
        locale={locale}
        nickname={profile?.nickname}
        settingsPath={`/${locale}/health/settings`}
      />
      <div className="mt-4 flex-1 overflow-hidden">
        <CategoryList categories={categories} locale={locale} />
      </div>
    </div>
  );
}
