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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#102216", // PRD Dark Forest Green
        position: "relative",
      }}
    >
      {/* Background Glows - Using absolute sizes for safety */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 500,
          height: 500,
          background: "rgba(19, 236, 91, 0.1)",
          borderRadius: "250px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 600,
          height: 600,
          background: "rgba(19, 236, 91, 0.05)",
          borderRadius: "300px",
        }}
      />

      <div
        style={{
          display: "flex",
          width: "1100px",
          height: "500px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Text Content */}
        <div style={{ display: "flex", flexDirection: "column", width: "600px" }}>
          <div
            style={{
              background: "#13ec5b",
              color: "#1d3a24",
              padding: "10px 24px",
              borderRadius: "100px",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "32px",
              width: "fit-content",
            }}
          >
            Mandalart 2026
          </div>

          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              lineHeight: "1.1",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>꿈을 현실로 만드는</span>
            <span style={{ color: "#13ec5b" }}>가장 확실한 기술</span>
          </div>

          <div style={{ fontSize: "32px", color: "rgba(255, 255, 255, 0.5)" }}>
            AI 코칭과 함께하는 목표 달성 플래너
          </div>
        </div>

        {/* Right: Grid Graphic */}
        <div
          style={{
            display: "flex",
            width: "380px",
            height: "380px",
            flexWrap: "wrap",
            gap: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "15px",
            borderRadius: "32px",
            border: "1px solid rgba(19, 236, 91, 0.2)",
          }}
        >
          {/* Hardcoded 9 squares to avoid transition issues in some Satori versions */}
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{ width: "110px", height: "110px", background: "#13ec5b", borderRadius: "12px" }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "110px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          width: "100%",
          textAlign: "center",
          color: "rgba(255,255,255,0.15)",
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
