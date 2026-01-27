import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "#3b82f6",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "20%",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="9" y="2" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="16" y="2" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="2" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" fill="white" />
        <rect x="16" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="2" y="16" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="9" y="16" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="16" y="16" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
