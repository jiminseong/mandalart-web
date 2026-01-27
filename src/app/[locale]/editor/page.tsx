import { Link } from "@/i18n/routing";
import { ArrowLeft, Share2, MessageSquarePlus } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { NodeEditor } from "@/components/editor/NodeEditor";
import { ProgressBar } from "@/components/editor/ProgressBar";
import { AuthSyncManager } from "@/components/auth/AuthSyncManager";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function EditorPage() {
  const t = await getTranslations("editor");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white hidden sm:block">
            {t("title")}
          </h1>
          <h1 className="text-xl font-black text-slate-900 dark:text-white sm:hidden">2026</h1>
          <LanguageSwitcher />
        </div>

        <ProgressBar />
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center relative">
        <MandalartGrid />

        {/* Bottom Actions */}
        <div className="absolute bottom-8 flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <Link
            href="/feedback"
            className="group flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <MessageSquarePlus
                size={20}
                className="text-slate-400 group-hover:text-primary transition-colors"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              {t("feedback")}
            </span>
          </Link>

          <Link
            href="/share"
            className="group flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all"
          >
            <Share2
              size={20}
              className="text-slate-400 group-hover:text-primary transition-colors"
            />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              {t("share")}
            </span>
          </Link>
        </div>
      </main>

      <NodeEditor />
      <AuthSyncManager />
    </div>
  );
}
