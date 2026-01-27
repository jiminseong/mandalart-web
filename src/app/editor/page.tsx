import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { DebugPanel } from "@/components/DebugPanel";
import { NodeEditor } from "@/components/editor/NodeEditor";

export default function EditorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Mandalart 2026</h1>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <MandalartGrid />
      </main>

      <DebugPanel />
      <NodeEditor />
    </div>
  );
}
