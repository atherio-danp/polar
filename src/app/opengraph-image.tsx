import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Polar — an interactive opinion dynamics simulator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Decorative dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            opacity: 0.15,
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${12 + (i % 5) * 4}px`,
                height: `${12 + (i % 5) * 4}px`,
                borderRadius: "50%",
                background:
                  i % 3 === 0
                    ? "#3b82f6"
                    : i % 3 === 1
                      ? "#f97316"
                      : "#8b5cf6",
                top: `${10 + ((i * 137) % 80)}%`,
                left: `${5 + ((i * 173) % 90)}%`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-2px",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          Polar
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Watch how opinions form, spread, and divide
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["Opinion Dynamics", "AI Commentary", "Social Science"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(139, 92, 246, 0.2)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: 18,
                  color: "#c4b5fd",
                  display: "flex",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
