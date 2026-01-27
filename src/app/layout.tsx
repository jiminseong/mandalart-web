import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandalart 2026",
  description: "꿈을 현실로 만드는 만다라트 계획표",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>{/* Preload fonts if needed, but CDN is fine */}</head>
      <body className="antialiased bg-white text-slate-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
