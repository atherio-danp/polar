import type { SimulationConfig } from "@/simulation/types";
import { DEFAULT_MEDIA_SOURCES } from "@/lib/constants";

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  config: SimulationConfig;
}

function mediaSources(
  overrides: Partial<Record<"left" | "right" | "centrist", { enabled: boolean; reach: number }>>
) {
  const defaults = DEFAULT_MEDIA_SOURCES.map((s) => ({ ...s }));
  if (overrides.left) {
    defaults[0] = { ...defaults[0], ...overrides.left };
  }
  if (overrides.right) {
    defaults[1] = { ...defaults[1], ...overrides.right };
  }
  if (overrides.centrist) {
    defaults[2] = { ...defaults[2], ...overrides.centrist };
  }
  return defaults;
}

export const PRESETS: Preset[] = [
  {
    id: "open-society",
    name: "Open Society",
    tagline: "Tolerant debate, gradual convergence",
    description:
      "A tolerant society where people engage with different viewpoints. Based on deliberative democracy models (Nordic countries) — disagreement exists, but rejection is rare. Watch opinions slowly converge into soft clusters.",
    config: {
      agentCount: 200,
      baseTolerance: 1.2,
      attractionRate: 0.08,
      rejectionRate: 0.005,
      confirmationBias: 0.1,
      peerInfluenceRatio: 0.6,
      confidenceSpread: 0.3,
      initialCorrelation: 0.3,
      messageMode: "random",
      mediaSources: mediaSources({}),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
  {
    id: "echo-chambers",
    name: "Echo Chambers",
    tagline: "Filter bubbles seal off groups",
    description:
      "A society where people mostly hear from like-minded peers — like social media feeds that show you what you already agree with. Self-sorting creates isolated opinion bubbles without any media pushing it. Based on filter bubble research (Pariser, Sunstein).",
    config: {
      agentCount: 300,
      baseTolerance: 0.45,
      attractionRate: 0.1,
      rejectionRate: 0.04,
      confirmationBias: 0.8,
      peerInfluenceRatio: 0.85,
      confidenceSpread: 0.5,
      initialCorrelation: 0.6,
      messageMode: "random",
      mediaSources: mediaSources({}),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
  {
    id: "culture-war",
    name: "Culture War",
    tagline: "Two camps, vanishing center",
    description:
      "Two dominant media camps pull the population apart while pushback from the 'other side' drives people further into their corner. Moderates get squeezed out. Inspired by US political polarization and affective polarization research (Iyengar & Westwood).",
    config: {
      agentCount: 300,
      baseTolerance: 0.7,
      attractionRate: 0.08,
      rejectionRate: 0.06,
      confirmationBias: 0.5,
      peerInfluenceRatio: 0.5,
      confidenceSpread: 0.4,
      initialCorrelation: 0.8,
      messageMode: "polarized",
      mediaSources: mediaSources({
        left: { enabled: true, reach: 0.6 },
        right: { enabled: true, reach: 0.6 },
      }),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
  {
    id: "radicalization",
    name: "Radicalization Spiral",
    tagline: "Extremists capture the moderates",
    description:
      "Highly persuadable moderates meet a few committed extremists. The moderates listen to everyone; the extremists only listen to each other. Watch who wins. Based on Deffuant's 'single extreme convergence' and Centola's tipping point research.",
    config: {
      agentCount: 200,
      baseTolerance: 0.8,
      attractionRate: 0.15,
      rejectionRate: 0.07,
      confirmationBias: 0.6,
      peerInfluenceRatio: 0.7,
      confidenceSpread: 0.8,
      initialCorrelation: 0.6,
      messageMode: "polarized",
      mediaSources: mediaSources({}),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
  {
    id: "tribal-factions",
    name: "Tribal Factions",
    tagline: "Shattered into rigid fragments",
    description:
      "People only tolerate views very close to their own and reject everything else. Society shatters into many small, isolated factions that can't bridge their divides. Tolerance is below the critical ~0.2 threshold from Hegselmann-Krause models.",
    config: {
      agentCount: 250,
      baseTolerance: 0.3,
      attractionRate: 0.08,
      rejectionRate: 0.04,
      confirmationBias: 0.7,
      peerInfluenceRatio: 0.9,
      confidenceSpread: 0.5,
      initialCorrelation: 0.4,
      messageMode: "random",
      mediaSources: mediaSources({}),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
  {
    id: "melting-pot",
    name: "Melting Pot",
    tagline: "Diverse start, slow mixing",
    description:
      "A diverse population with no pre-existing political alignment. People start all over the map but frequent cross-cutting interactions gradually build bridges. Inspired by cosmopolitan urban centers and Allport's contact hypothesis.",
    config: {
      agentCount: 500,
      baseTolerance: 1.0,
      attractionRate: 0.06,
      rejectionRate: 0.01,
      confirmationBias: 0.1,
      peerInfluenceRatio: 0.75,
      confidenceSpread: 0.4,
      initialCorrelation: 0.1,
      messageMode: "random",
      mediaSources: mediaSources({}),
      interactionsPerStep: 30,
      simulationSpeed: 10,
    },
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
