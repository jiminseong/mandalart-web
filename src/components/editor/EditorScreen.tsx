import { Link } from "@/i18n/routing";
import { Save } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { ProgressBar } from "@/components/editor/ProgressBar";
import { GridSizeControls } from "@/components/editor/GridSizeControls";
import { TextSizeControls } from "@/components/editor/TextSizeControls";
import { EditorBackButton } from "@/components/editor/EditorBackButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EditorStateHydrator } from "@/components/editor/EditorStateHydrator";

export async function EditorScreen({ encoded }: { encoded?: string }) {
  const t = await getTranslations("editor");
  const actionLabel = t("saveMandalart");

  return (
    <div className="min-h-screen flex flex-col bg-base text-text-primary overflow-hidden">
      <EditorStateHydrator encoded={encoded} />

      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border transition-all">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <EditorBackButton backLabel={t("back")} />

          <h1 className="text-xl font-serif font-bold tracking-tight text-text-primary absolute left-1/2 -translate-x-1/2">
            Mandalart
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col relative w-full overflow-hidden">
        <div className="shrink-0 px-6 pt-5 pb-2">
          <div className="mx-auto flex w-full max-w-[420px] items-center justify-center gap-3">
            <ProgressBar />
            <TextSizeControls />
            <GridSizeControls />
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full overflow-hidden">
          <MandalartGrid />
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-6 pt-12 sm:px-6">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-base via-base/92 to-transparent" />
        <Link
          href="/share"
          aria-label={actionLabel}
          title={actionLabel}
          className="pointer-events-auto relative flex h-14 w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-text-primary px-6 text-sm font-semibold text-accent-contrast shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:bg-text-secondary"
        >
          <Save size={18} strokeWidth={1.8} />
          <span>{actionLabel}</span>
        </Link>
      </div>

    </div>
  );
}
