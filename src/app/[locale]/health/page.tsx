import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Modify this if you have a specific login page
    redirect(`/${locale}/login?next=/health`);
  }

  // Check if health profile exists
  const { data: profile } = await supabase
    .from("health_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect(`/${locale}/health/onboarding`);
  }

  redirect(`/${locale}/health/dashboard/today`);
}
