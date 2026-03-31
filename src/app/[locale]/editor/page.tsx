import { Link } from "@/i18n/routing";
import { Share2 } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { NodeEditor } from "@/components/editor/NodeEditor";
import { ProgressBar } from "@/components/editor/ProgressBar";
import { GridSizeControls } from "@/components/editor/GridSizeControls";
import { EditorBackButton } from "@/components/editor/EditorBackButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
// import { AuthSyncManager } from "@/components/auth/AuthSyncManager";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function EditorPage() {
  const t = await getTranslations("editor");

  return (
    <div className="min-h-screen flex flex-col bg-base text-text-primary overflow-hidden">
      {/* Editorial Header */}
      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border transition-all">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <EditorBackButton backLabel={t("back")} />

          <h1 className="text-xl font-serif font-bold tracking-tight text-text-primary absolute left-1/2 -translate-x-1/2">
            Mandalart
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border/50">
              {/* <Link
                href="/feedback"
                className="p-2 text-text-secondary hover:text-growth transition-colors"
                title={t("feedback")}
              >
                <MessageSquarePlus size={20} strokeWidth={1.5} />
              </Link> */}
              <Link
                href="/share"
                className="p-2 text-text-secondary hover:text-focus transition-colors"
                title={t("share")}
              >
                <Share2 size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 flex flex-col relative w-full overflow-hidden">
        <div className="shrink-0 px-6 pt-5 pb-2">
          <div className="mx-auto flex w-full max-w-[420px] items-center justify-center gap-3">
            <ProgressBar />
            <GridSizeControls />
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full overflow-hidden">
          <MandalartGrid />

          {/* Mobile Bottom Actions (Floating) - Only Visible on Mobile */}
          <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            {/* <Link
              href="/feedback"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-strong shadow-lg text-text-secondary transition-colors hover:text-growth"
            >
              <MessageSquarePlus size={20} strokeWidth={1.5} />
            </Link> */}
            <Link
              href="/share"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-text-primary text-accent-contrast shadow-lg transition-transform hover:scale-105 hover:bg-text-secondary"
            >
              <Share2 size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </main>

      <NodeEditor />
      {/* <AuthSyncManager /> */}
    </div>
  );
}
