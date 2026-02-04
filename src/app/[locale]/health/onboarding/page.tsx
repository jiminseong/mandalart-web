import { redirect } from "next/navigation";

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Always start check from nickname, logical flow will handle skips if data exists (future improvement)
  // For now, force flow start
  redirect(`/${locale}/health/onboarding/nickname`);
}
