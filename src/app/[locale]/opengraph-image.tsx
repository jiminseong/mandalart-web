import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "만다라트 2026 - Mandalart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        backgroundColor: "#102216", // Deep Dark Forest Green
        padding: "0",
        margin: "0",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative SVG Pattern */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#13ec5b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#grid)" />
      </svg>

      {/* Glow Effects */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(19, 236, 91, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(19, 236, 91, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main Content Layout */}
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "0 80px",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Left Side: Text */}
        <div style={{ display: "flex", flexDirection: "column", width: "600px" }}>
          <div
            style={{
              background: "#13ec5b",
              color: "#102216",
              padding: "10px 24px",
              borderRadius: "100px",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "36px",
              display: "flex",
              width: "fit-content",
            }}
          >
            Mandalart 2026
          </div>

          <div
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "white",
              lineHeight: "1.1",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ marginBottom: "10px" }}>꿈을 현실로</span>
            <span style={{ color: "#13ec5b" }}>만드는 기술</span>
          </div>

          <div style={{ fontSize: "34px", color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" }}>
            AI와 함께하는 스마트한 목표 수립
          </div>
        </div>

        {/* Right Side: Visual Graphic (Mandalart Shape) */}
        <div style={{ display: "flex", position: "relative", width: "400px", height: "400px" }}>
          {/* 3x3 Grid using flex and specific squares */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              padding: "20px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "40px",
              border: "1px solid rgba(19, 236, 91, 0.15)",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                style={{
                  width: "114px",
                  height: "114px",
                  backgroundColor: i === 4 ? "#13ec5b" : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i === 4 && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#102216",
                      borderRadius: "8px",
                      opacity: 0.8,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branding Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "80px",
          color: "rgba(255,255,255,0.2)",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        www.mandalart.life
      </div>
    </div>,
    {
      ...size,
    },
  );
}
