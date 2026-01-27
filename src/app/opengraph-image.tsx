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
        padding: "80px",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* Simple Side Glows */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: "rgba(19, 236, 91, 0.15)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          background: "rgba(19, 236, 91, 0.1)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
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
              padding: "10px 24px",
              borderRadius: "100px",
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
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
              fontSize: "76px",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.2,
              marginBottom: "28px",
            }}
          >
            <span>꿈을 현실로 만드는</span>
            <span style={{ color: "#13ec5b" }}>가장 확실한 기술</span>
          </div>

          <div
            style={{
              fontSize: "32px",
              color: "rgba(255, 255, 255, 0.6)",
              display: "flex",
            }}
          >
            성공을 위한 64단계 AI 계획표
          </div>
        </div>

        {/* Visual Side (Simplified 3x3 Grid Graphic) */}
        <div
          style={{
            display: "flex",
            width: "400px",
            height: "400px",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "12px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: "40px",
            border: "1px solid rgba(19, 236, 91, 0.1)",
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
                border: i === 4 ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Domain Footer */}
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
