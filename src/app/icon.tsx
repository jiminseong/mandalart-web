import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1" y="1" width="62" height="62" rx="14" fill="#F5F5F0" stroke="#D1D1C7" strokeWidth="2" />
        <path
          d="M18 47V17L32 35L46 17V47"
          stroke="#2E3A45"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
