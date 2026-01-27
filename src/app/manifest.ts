import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "만다라트 2026 - 오타니 쇼헤이의 목표 달성법",
    short_name: "만다라트 2026",
    description: "꿈을 현실로 만드는 만다라트 계획표",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#13ec5b",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
