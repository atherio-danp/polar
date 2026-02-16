// Map z-axis value (Equality ↔ Merit) to color
// -1 = blue (#3b82f6), 0 = neutral gray, +1 = orange (#f97316)
export function beliefToColor(zValue: number): string {
  // Normalize from [-1, 1] to [0, 1]
  const t = (zValue + 1) / 2;

  // Blue (59, 130, 246) → Gray (148, 148, 148) → Orange (249, 115, 22)
  let r: number, g: number, b: number;
  if (t < 0.5) {
    const s = t * 2; // 0 to 1 within blue→gray
    r = Math.round(59 + (148 - 59) * s);
    g = Math.round(130 + (148 - 130) * s);
    b = Math.round(246 + (148 - 246) * s);
  } else {
    const s = (t - 0.5) * 2; // 0 to 1 within gray→orange
    r = Math.round(148 + (249 - 148) * s);
    g = Math.round(148 + (115 - 148) * s);
    b = Math.round(148 + (22 - 148) * s);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

// Confidence → dot radius: 3px (low) → 6px (high)
export function confidenceToSize(confidence: number): number {
  return 3 + confidence * 3;
}

// Confidence → opacity: 0.4 (low) → 1.0 (high)
export function confidenceToOpacity(confidence: number): number {
  return 0.4 + confidence * 0.6;
}
