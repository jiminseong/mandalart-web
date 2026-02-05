import OSSwitcher from "@/components/OSSwitcher";

export default async function TodoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">
      <main className="max-w-md mx-auto min-h-screen relative bg-white dark:bg-black overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none p-4">
        <section className="pt-2 px-1 mb-8">
          <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Todo OS
          </span>
          <div className="flex items-end justify-between mt-1">
            <OSSwitcher currentOS="Todo" locale={locale} />
          </div>
        </section>

        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black dark:text-white">Todo OS</h2>
          <p className="text-sm text-gray-500 text-center max-w-[200px]">
            만다라트 기반의 강력한 할 일 관리 시스템이 곧 출시됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
