import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { ProgressBar } from "@/components/editor/ProgressBar";
import { GridSizeControls } from "@/components/editor/GridSizeControls";
import { TextSizeControls } from "@/components/editor/TextSizeControls";
import { EditorBackButton } from "@/components/editor/EditorBackButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EditorStateHydrator } from "@/components/editor/EditorStateHydrator";
import { EditorActionBar } from "@/components/editor/EditorActionBar";

export async function EditorScreen({ encoded }: { encoded?: string }) {
  const t = await getTranslations("editor");

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

      <EditorActionBar />

    </div>
  );
}
