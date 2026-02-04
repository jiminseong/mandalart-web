import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black pb-24">
      {/* 
         We removed the sticky header and bottom nav here.
         The bottom nav is now in the parent HealthLayout.
         The header is handled by individual pages (Large Title) or not needed.
      */}
      <main className="flex-1 w-full px-5 pt-2">{children}</main>
    </div>
  );
}
