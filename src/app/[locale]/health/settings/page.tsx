"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect to common settings page
    router.replace(`/${locale}/settings`);
  }, [locale, router]);

  return null;
}
