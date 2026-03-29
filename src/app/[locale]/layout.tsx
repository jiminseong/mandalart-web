import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
// import { AuthErrorHandler } from "@/components/AuthErrorHandler";

import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "만다라트 2026 - 오타니 쇼헤이의 목표 달성법",
  description:
    "오타니 쇼헤이의 성공 비결, 만다라트 기법으로 2026년 목표를 체계적으로 계획하고 AI 코칭과 함께 달성해보세요.",
  metadataBase: new URL("https://mandalart.life"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "만다라트 2026",
    description: "꿈을 현실로 만드는 가장 확실한 방법, 만다라트 계획표",
    url: "https://mandalart.life",
    siteName: "Mandalart 2026",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "만다라트 2026 미리보기",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "만다라트 2026",
    description: "2026년 목표 달성을 위한 AI 만다라트 플래너",
    images: ["/og-image.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "6f5ed20b15cdfacfee02a434b86948063b4b1f01",
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeCandidate = locale as (typeof routing.locales)[number];

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(localeCandidate)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="white" suppressHydrationWarning>
      <Analytics />
      <body className="font-sans antialiased">
        {/* <AuthErrorHandler /> */}
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
