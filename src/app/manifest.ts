import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "만다라트 2026 - 오타니 쇼헤이의 목표 달성법",
    short_name: "만다라트 2026",
    description: "꿈을 현실로 만드는 만다라트 계획표",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f0",
    theme_color: "#f5f5f0",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
