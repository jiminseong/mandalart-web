import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "만다라트 2026 - 오타니 쇼헤이의 목표 달성법",
  description:
    "오타니 쇼헤이의 성공 비결, 만다라트 기법으로 2026년 목표를 체계적으로 계획하고 AI 코칭과 함께 달성해보세요.",
  metadataBase: new URL("https://mandalart.life"),
  openGraph: {
    title: "만다라트 2026",
    description: "꿈을 현실로 만드는 가장 확실한 방법, 만다라트 계획표",
    url: "https://mandalart.life",
    siteName: "Mandalart 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "만다라트 2026",
    description: "2026년 목표 달성을 위한 AI 만다라트 플래너",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-white text-slate-900 font-sans">
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
