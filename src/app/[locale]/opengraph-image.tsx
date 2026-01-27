import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "만다라트 2026 - Mandalart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        backgroundColor: "#102216", // PRD Dark Forest Green
        backgroundImage: "radial-gradient(circle at 50% 50%, #1a3a24 0%, #102216 100%)",
        padding: "60px",
        position: "relative",
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 400 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "60px",
              height: "60px",
              border: "0.5px solid #13ec5b",
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          zIndex: 10,
        }}
      >
        {/* Text Side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              background: "#13ec5b",
              color: "#102216",
              padding: "8px 24px",
              borderRadius: "100px",
              fontSize: "24px",
              fontWeight: "900",
              display: "inline-flex",
              width: "fit-content",
              marginBottom: "32px",
            }}
          >
            Mandalart 2026
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "72px",
              fontWeight: "900",
              color: "white",
              lineHeight: "1.1",
              marginBottom: "24px",
              letterSpacing: "-3px",
            }}
          >
            <span>꿈을 현실로 만드는</span>
            <span style={{ color: "#13ec5b" }}>가장 확실한 기술</span>
          </div>

          <p
            style={{
              fontSize: "32px",
              color: "#94a3b8",
              margin: 0,
              opacity: 0.8,
            }}
          >
            성공하는 사람들의 목표 관리법, AI 코칭과 시작하세요.
          </p>
        </div>

        {/* Visual Side (Mandalart Grid Graphic) */}
        <div
          style={{
            display: "flex",
            width: "420px",
            height: "420px",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
            padding: "10px",
            backgroundColor: "rgba(19, 236, 91, 0.05)",
            borderRadius: "24px",
            border: "1px solid rgba(19, 236, 91, 0.2)",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "calc(33.33% - 7px)",
                height: "calc(33.33% - 7px)",
                backgroundColor: i === 4 ? "#13ec5b" : "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: i === 4 ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
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

      {/* Bottom Branding */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          color: "rgba(255,255,255,0.2)",
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
