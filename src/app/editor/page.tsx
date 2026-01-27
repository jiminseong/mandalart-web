import Link from "next/link";
import { ArrowLeft, Share2, MessageSquarePlus } from "lucide-react";
import { MandalartGrid } from "@/components/grid/MandalartGrid";
import { NodeEditor } from "@/components/editor/NodeEditor";
import { ProgressBar } from "@/components/editor/ProgressBar";
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white hidden sm:block">
            Mandalart 2026
          </h1>
          <h1 className="text-xl font-black text-slate-900 dark:text-white sm:hidden">2026</h1>
        </div>

        <ProgressBar />

        <div className="flex items-center gap-2">
          <Link
            href="/feedback"
            className="p-2 text-slate-400 hover:text-primary transition-colors"
            title="피드백 남기기"
          >
            <div className="relative">
              <MessageSquarePlus size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </Link>
          <Link
            href="/share"
            className="p-2 text-slate-400 hover:text-primary transition-colors"
            title="공유하기"
          >
            <Share2 size={24} />
          </Link>
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
