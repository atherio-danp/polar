"use client";

import { useEffect, useRef } from "react";
import type { SimulationState } from "@/simulation/types";
import { beliefToColor, confidenceToSize, confidenceToOpacity } from "@/lib/colors";
import { AXIS_LABELS } from "@/lib/constants";

interface Canvas2DProps {
  state: SimulationState;
  width: number;
  height: number;
}

const PADDING = 48;

export default function Canvas2D({ state, width, height }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas for high DPI
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const plotW = width - PADDING * 2;
    const plotH = height - PADDING * 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Plot area
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(PADDING, PADDING, plotW, plotH);

    // Grid lines (subtle)
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 0.5;
    const gridSteps = 4;
    for (let i = 1; i < gridSteps; i++) {
      const fx = PADDING + (plotW * i) / gridSteps;
      const fy = PADDING + (plotH * i) / gridSteps;
      ctx.beginPath();
      ctx.moveTo(fx, PADDING);
      ctx.lineTo(fx, PADDING + plotH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PADDING, fy);
      ctx.lineTo(PADDING + plotW, fy);
      ctx.stroke();
    }

    // Crosshair at origin
    const cx = PADDING + plotW / 2;
    const cy = PADDING + plotH / 2;
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, PADDING);
    ctx.lineTo(cx, PADDING + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PADDING, cy);
    ctx.lineTo(PADDING + plotW, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Quadrant labels (subtle)
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.textAlign = "center";
    const qOffset = 36;
    ctx.fillText("Conservative + Safety", PADDING + plotW * 0.25, PADDING + qOffset);
    ctx.fillText("Progressive + Safety", PADDING + plotW * 0.75, PADDING + qOffset);
    ctx.fillText("Conservative + Freedom", PADDING + plotW * 0.25, PADDING + plotH - qOffset + 12);
    ctx.fillText("Progressive + Freedom", PADDING + plotW * 0.75, PADDING + plotH - qOffset + 12);

    // Draw agents
    for (const agent of state.agents) {
      // Map beliefs to canvas coordinates
      // x: beliefs[0] from [-1,1] → [PADDING, PADDING+plotW]
      // y: beliefs[1] from [-1,1] → [PADDING+plotH, PADDING] (inverted: -1=bottom, +1=top)
      const x = PADDING + ((agent.beliefs[0] + 1) / 2) * plotW;
      const y = PADDING + ((1 - agent.beliefs[1]) / 2) * plotH;
      const radius = confidenceToSize(agent.confidence);
      const opacity = confidenceToOpacity(agent.confidence);
      const color = beliefToColor(agent.beliefs[2]);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Draw media sources as diamonds
    for (const source of state.config.mediaSources) {
      if (!source.enabled) continue;
      const x = PADDING + ((source.beliefs[0] + 1) / 2) * plotW;
      const y = PADDING + ((1 - source.beliefs[1]) / 2) * plotH;
      const size = 10;

      // Pulsing effect using step count
      const pulse = 1 + 0.2 * Math.sin(state.step * 0.15);
      const s = size * pulse;

      ctx.fillStyle = beliefToColor(source.beliefs[2]);
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x - s, y);
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(source.label, x, y - s - 6);
    }

    ctx.globalAlpha = 1;

    // Axis labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui, sans-serif";

    // X-axis
    ctx.textAlign = "left";
    ctx.fillText(`← ${AXIS_LABELS[0].negative}`, PADDING, height - 10);
    ctx.textAlign = "right";
    ctx.fillText(`${AXIS_LABELS[0].positive} →`, width - PADDING, height - 10);

    // Y-axis
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(14, PADDING + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`← ${AXIS_LABELS[1].negative}`, -plotH / 4, 0);
    ctx.fillText(`${AXIS_LABELS[1].positive} →`, plotH / 4, 0);
    ctx.restore();

    // Color legend (z-axis) at bottom center
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Color: Share equally (blue) ↔ Earn your own (orange)", width / 2, height - 10);
  }, [state, width, height, dpr]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}
