export interface Agent {
  id: number;
  beliefs: [number, number, number]; // [-1, +1] per axis
  confidence: number; // 0–1
}

export interface Message {
  axis: 0 | 1 | 2;
  value: number; // effective position in [-1, +1]
}

export interface MediaSource {
  id: number;
  enabled: boolean;
  beliefs: [number, number, number]; // fixed position
  reach: number; // fraction of agents exposed per step (0–1)
  label: string;
}

export interface SimulationConfig {
  agentCount: number; // 50–1000, default 200
  baseTolerance: number; // 0.1–2.0, default 0.5
  attractionRate: number; // alpha: 0.01–0.3, default 0.05
  rejectionRate: number; // beta: 0.0–0.1, default 0.02
  interactionsPerStep: number; // total interactions per tick
  peerInfluenceRatio: number; // 0–1: fraction agent-to-agent vs environmental
  confirmationBias: number; // 0–1: strength of same-side preference
  confidenceSpread: number; // 0–1: distribution of agent confidence
  initialCorrelation: number; // 0–1: how correlated axes are at start
  messageMode: "random" | "polarized" | "moderate";
  mediaSources: MediaSource[];
  simulationSpeed: number; // 1–60 steps per second
}

export interface SimulationState {
  agents: Agent[];
  step: number;
  config: SimulationConfig;
}

export interface SimulationStats {
  step: number;
  clusterCount: number;
  polarizationIndex: number;
  axisMeans: [number, number, number];
  axisSpreads: [number, number, number];
  quadrantCounts: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  zoneCounts: {
    center: number;
    edges: number;
    corners: number;
  };
}

export interface Insight {
  id: number;
  step: number;
  text: string;
  timestamp: number;
}
