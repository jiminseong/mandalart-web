import { TodoTabBar } from "./components/TodoTabBar";

export default async function TodoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="h-[100dvh] bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 overflow-hidden">
      <main className="max-w-md mx-auto h-full relative bg-white dark:bg-black overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none flex flex-col">
        <div className="flex-1 overflow-hidden relative flex flex-col pb-[calc(80px+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <TodoTabBar locale={locale} />
      </main>
    </div>
  );
}
