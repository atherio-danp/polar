export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="#1e1b4b" />
      {/* Blue cluster — bottom-left */}
      <circle cx="9" cy="21" r="4.5" fill="#3b82f6" />
      <circle cx="14" cy="19" r="3" fill="#60a5fa" opacity="0.8" />
      {/* Violet — center */}
      <circle cx="16" cy="14" r="5" fill="#8b5cf6" />
      <circle cx="21" cy="16" r="3.2" fill="#a78bfa" opacity="0.8" />
      {/* Orange cluster — top-right */}
      <circle cx="24" cy="9" r="4" fill="#f97316" />
      <circle cx="19" cy="11" r="2.5" fill="#fb923c" opacity="0.8" />
    </svg>
  );
}
