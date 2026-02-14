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
    <div className="min-h-screen flex flex-col bg-base text-text-primary overflow-hidden">
      {/* Editorial Header */}
      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border transition-all">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden md:inline text-sm font-medium tracking-wide">Back</span>
          </Link>

          <h1 className="text-xl font-serif font-bold tracking-tight text-text-primary absolute left-1/2 -translate-x-1/2">
            Mandalart
          </h1>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border/50">
              <Link
                href="/feedback"
                className="p-2 text-text-secondary hover:text-growth transition-colors"
                title={t("feedback")}
              >
                <MessageSquarePlus size={20} strokeWidth={1.5} />
              </Link>
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

        {/* Progress Bar Area */}
        <div className="px-6 pb-0">
          <ProgressBar />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden">
        <MandalartGrid />

        {/* Mobile Bottom Actions (Floating) - Only Visible on Mobile */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          <Link
            href="/feedback"
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-border text-text-secondary hover:text-growth transition-colors"
          >
            <MessageSquarePlus size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/share"
            className="flex items-center justify-center w-12 h-12 bg-text-primary text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <Share2 size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </main>

      <NodeEditor />
      {/* <AuthSyncManager /> */}
    </div>
  );
}
