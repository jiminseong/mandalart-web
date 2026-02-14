import { Link } from "@/i18n/routing";
import { ArrowLeft, Share2, MessageSquarePlus } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { NodeEditor } from "@/components/editor/NodeEditor";
import { ProgressBar } from "@/components/editor/ProgressBar";
// import { AuthSyncManager } from "@/components/auth/AuthSyncManager";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function EditorPage() {
  const t = await getTranslations("editor");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* iOS-style Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-black/5 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto px-4 h-11 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 active:opacity-50 transition-opacity"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>

          <h1 className="text-base font-semibold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">
            {t("title")}
          </h1>

          <LanguageSwitcher />
        </div>

        <div className="px-4 pb-2">
          <ProgressBar />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative p-4">
        <MandalartGrid />

        {/* Bottom Actions - iOS Safe Area */}
        <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-t border-black/5 dark:border-white/5">
          <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <Link
              href="/feedback"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl active:opacity-70 transition-opacity"
            >
              <div className="relative">
                <MessageSquarePlus
                  size={18}
                  className="text-slate-600 dark:text-slate-300"
                  strokeWidth={2}
                />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("feedback")}
              </span>
            </Link>

            <Link
              href="/share"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-colors"
            >
              <Share2 size={18} className="text-white" strokeWidth={2} />
              <span className="text-sm font-semibold text-white">{t("share")}</span>
            </Link>
          </div>
        </div>
      </main>

      <NodeEditor />
      {/* <AuthSyncManager /> */}
    </div>
  );
}
