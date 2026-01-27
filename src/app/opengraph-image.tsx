import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "만다라트 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const blue = "#3b82f6";
  const black = "#000000";

  return new ImageResponse(
    <div
      style={{
        height: "630px",
        width: "1200px",
        display: "flex",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Left: Text */}
      <div
        style={{
          position: "absolute",
          left: "80px",
          top: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "700px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "100px",
            fontWeight: "900",
            lineHeight: "1",
            color: black,
          }}
        >
          만다라트
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "120px",
            fontWeight: "900",
            lineHeight: "1",
            color: blue,
          }}
        >
          2026
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "36px",
            fontWeight: "500",
            color: "#64748b",
            marginTop: "40px",
          }}
        >
          꿈을 현실로 만드는 가장 확실한 방법
        </div>
      </div>

      {/* Right: Grid Visual */}
      <div
        style={{
          position: "absolute",
          right: "80px",
          top: "115px",
          width: "400px",
          height: "400px",
          display: "flex",
          flexWrap: "wrap",
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "40px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: blue,
            borderRadius: "12px",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            width: "113px",
            height: "113px",
            margin: "3px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "80px",
          fontSize: "20px",
          color: "#cbd5e1",
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
