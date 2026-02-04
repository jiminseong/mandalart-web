import { HealthTabBar } from "@/components/HealthTabBar";

export default async function HealthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">
      <main className="max-w-md mx-auto min-h-screen relative bg-white dark:bg-black overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none">
        {children}
        <HealthTabBar locale={locale} />
      </main>
    </div>
  );
}
