import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Mandalart 2026";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc", // slate-50
        backgroundImage:
          "radial-gradient(#e2e8f0 1px, transparent 1px), radial-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px 80px",
          borderRadius: "32px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#13ec5b", // Primary Green
            color: "white",
            padding: "8px 20px",
            borderRadius: "50px",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Mandalart 2026
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#0f172a", // Slate 900
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 20,
            letterSpacing: "-2px",
          }}
        >
          꿈을 현실로 만드는
          <br />
          만다라트 계획표
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#64748b", // Slate 500
            textAlign: "center",
          }}
        >
          오타니 쇼헤이의 목표 달성법, AI와 함께 시작하세요
        </div>
      </div>

      {/* Simple Grid Graphic Decoration */}
      <div style={{ display: "flex", gap: "4px", marginTop: "60px", opacity: 0.5 }}>
        <div
          style={{ width: "40px", height: "40px", background: "#3b82f6", borderRadius: "4px" }}
        ></div>
        <div
          style={{ width: "40px", height: "40px", background: "#cbd5e1", borderRadius: "4px" }}
        ></div>
        <div
          style={{ width: "40px", height: "40px", background: "#3b82f6", borderRadius: "4px" }}
        ></div>
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  );
}
