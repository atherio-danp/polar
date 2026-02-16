# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Polar — an interactive belief formation simulator implementing a multi-dimensional bounded-confidence model. Agents hold continuous beliefs on 3 axes and update when exposed to messages from peers or the environment. Built with Next.js, TypeScript, Tailwind CSS, and HTML Canvas.

## Build & Dev Commands

- `pnpm install` — install dependencies
- `pnpm dev` — start dev server (localhost:3000)
- `pnpm build` — production build
- `pnpm lint` — run ESLint

## Architecture

**Tech:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, HTML Canvas API. Zero additional runtime dependencies.

**File structure:**
```
src/
  simulation/
    types.ts         — Agent, Message, MediaSource, SimulationConfig, SimulationState, SimulationStats
    engine.ts        — createInitialState(), step(), message generation, pairwise logic
    analysis.ts      — computeStats(): clusters, polarization, per-axis means
  lib/
    constants.ts     — DEFAULTS, LIMITS, AXIS_LABELS, AXIS_COLORS
    colors.ts        — z-axis → color mapping, confidence → opacity/size
  hooks/
    useSimulation.ts — rAF loop, play/pause/reset/step, config hot-reload
  components/
    SimulationView.tsx — Top-level client component, layout, ResizeObserver
    Canvas2D.tsx       — 2D scatter plot with axis labels, crosshairs, quadrant labels
    ControlPanel.tsx   — Sliders, toggles, media source config, transport buttons
    StatsPanel.tsx     — Live metrics display
  app/
    layout.tsx       — Root layout, metadata
    page.tsx         — Renders <SimulationView />
    globals.css      — Tailwind directives + custom slider/scrollbar styles
```

**Model:** Agents have beliefs on 3 axes ([-1,+1] each): Tradition↔Progress (x), Freedom↔Security (y), Equality↔Merit (z/color). Update rule uses bounded-confidence with attraction/rejection, confirmation bias, peer vs environmental messages, and media sources.
