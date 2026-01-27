import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { NodeEditor } from "@/components/editor/NodeEditor";
import { AuthSyncManager } from "@/components/auth/AuthSyncManager";

export default function EditorPage() {
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Mandalart 2026</h1>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <MandalartGrid />
      </main>

      <NodeEditor />
      <AuthSyncManager />
    </div>
  );
}
