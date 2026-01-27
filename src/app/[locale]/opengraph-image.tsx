import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mandalart 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const isKo = locale === "ko";

  // Minimalist Blue (Professional Blue)
  const primaryBlue = "#3b82f6";
  const bgWhite = "#ffffff";
  const textSlate = "#1e293b";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgWhite,
        position: "relative",
        padding: "0 80px",
      }}
    >
      {/* Minimal Grid Background Accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1000px",
          height: "1000px",
          backgroundImage: `radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Text Side */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              fontSize: "84px",
              fontWeight: "900",
              color: textSlate,
              lineHeight: "1.1",
              marginBottom: "16px",
              letterSpacing: "-2px",
            }}
          >
            {isKo ? "만다라트" : "Mandalart"} <span style={{ color: primaryBlue }}>2026</span>
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "500",
              color: "#64748b",
              marginTop: "10px",
            }}
          >
            {isKo ? "성공을 위한 64개의 실행 계획" : "64 Action Plans for Your Success"}
          </div>
        </div>

        {/* Minimalist Visual (Simple 3x3 Grid Outline) */}
        <div
          style={{
            display: "flex",
            width: "360px",
            height: "360px",
            flexWrap: "wrap",
            gap: "8px",
            padding: "12px",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            borderRadius: "32px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "106px",
                height: "106px",
                backgroundColor: i === 4 ? primaryBlue : "white",
                borderRadius: "12px",
                border: i === 4 ? "none" : "1px solid rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 4 && (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "white",
                    borderRadius: "6px",
                    opacity: 0.8,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Domain */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "80px",
          color: "rgba(0,0,0,0.15)",
          fontSize: "20px",
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
