export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pb-20">
      {/* Safe Area Top Spacer (mimic) */}
      <div className="h-4 w-full" />

      <div className="max-w-md mx-auto px-6 pt-8 sm:pt-12">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[0.2,0.8,0.2,1]">
          {children}
        </div>
      </div>
    </div>
  );
}
