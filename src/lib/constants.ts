import type { SimulationConfig, MediaSource } from "@/simulation/types";

export const AXIS_LABELS = [
  { negative: "Conservative", positive: "Progressive" },
  { negative: "Personal Freedom", positive: "Collective Safety" },
  { negative: "Share Equally", positive: "Earn Your Own" },
] as const;

export const AXIS_COLORS = {
  x: "#8b5cf6", // violet
  y: "#06b6d4", // cyan
  z: { negative: "#3b82f6", positive: "#f97316" }, // blue → orange
} as const;

export const DEFAULT_MEDIA_SOURCES: MediaSource[] = [
  {
    id: 0,
    enabled: false,
    beliefs: [0.8, -0.6, -0.7],
    reach: 0.3,
    label: "Left Media",
  },
  {
    id: 1,
    enabled: false,
    beliefs: [-0.8, 0.6, 0.7],
    reach: 0.3,
    label: "Right Media",
  },
  {
    id: 2,
    enabled: false,
    beliefs: [0, 0, 0],
    reach: 0.3,
    label: "Centrist",
  },
];

export const DEFAULT_CONFIG: SimulationConfig = {
  agentCount: 200,
  baseTolerance: 1.0,
  attractionRate: 0.08,
  rejectionRate: 0.01,
  interactionsPerStep: 30,
  peerInfluenceRatio: 0.5,
  confirmationBias: 0.0,
  confidenceSpread: 0.3,
  initialCorrelation: 0.5,
  messageMode: "random",
  mediaSources: DEFAULT_MEDIA_SOURCES.map((s) => ({ ...s })),
  simulationSpeed: 10,
};

export const LIMITS = {
  agentCount: { min: 50, max: 1000, step: 10 },
  baseTolerance: { min: 0.1, max: 2.0, step: 0.05 },
  attractionRate: { min: 0.01, max: 0.3, step: 0.01 },
  rejectionRate: { min: 0.0, max: 0.1, step: 0.005 },
  peerInfluenceRatio: { min: 0, max: 1, step: 0.05 },
  confirmationBias: { min: 0, max: 1, step: 0.05 },
  confidenceSpread: { min: 0, max: 1, step: 0.05 },
  initialCorrelation: { min: 0, max: 1, step: 0.05 },
  simulationSpeed: { min: 1, max: 60, step: 1 },
  mediaReach: { min: 0, max: 1, step: 0.05 },
} as const;

// Parameters that require a reset when changed
export const RESET_PARAMS: (keyof SimulationConfig)[] = [
  "agentCount",
  "confidenceSpread",
  "initialCorrelation",
];

export const QUADRANT_LABELS = {
  topLeft: "Conservative + Safety",
  topRight: "Progressive + Safety",
  bottomLeft: "Conservative + Freedom",
  bottomRight: "Progressive + Freedom",
} as const;
