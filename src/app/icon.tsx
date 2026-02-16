import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: "6px",
        }}
      >
        {/* Blue dot — bottom-left */}
        <div
          style={{
            position: "absolute",
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: "#3b82f6",
            top: "17px",
            left: "5px",
          }}
        />
        {/* Violet dot — center */}
        <div
          style={{
            position: "absolute",
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            background: "#8b5cf6",
            top: "10px",
            left: "11px",
          }}
        />
        {/* Orange dot — top-right */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#f97316",
            top: "6px",
            left: "20px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
