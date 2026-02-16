import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          borderRadius: "36px",
        }}
      >
        {/* Blue dot cluster — bottom-left */}
        <div
          style={{
            position: "absolute",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#3b82f6",
            top: "105px",
            left: "30px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#60a5fa",
            top: "95px",
            left: "55px",
          }}
        />
        {/* Violet dots — center */}
        <div
          style={{
            position: "absolute",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#8b5cf6",
            top: "65px",
            left: "70px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#a78bfa",
            top: "80px",
            left: "100px",
          }}
        />
        {/* Orange dot cluster — top-right */}
        <div
          style={{
            position: "absolute",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#f97316",
            top: "38px",
            left: "115px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#fb923c",
            top: "50px",
            left: "95px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
