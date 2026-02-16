import type { Agent, SimulationStats } from "./types";

function euclideanDist(a: Agent, b: Agent): number {
  const dx = a.beliefs[0] - b.beliefs[0];
  const dy = a.beliefs[1] - b.beliefs[1];
  const dz = a.beliefs[2] - b.beliefs[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Simple single-linkage clustering with a distance threshold
function countClusters(agents: Agent[], threshold: number = 0.4): number {
  const n = agents.length;
  if (n === 0) return 0;

  const visited = new Uint8Array(n);
  let clusters = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    clusters++;
    // BFS from agent i
    const queue = [i];
    visited[i] = 1;
    while (queue.length > 0) {
      const cur = queue.pop()!;
      for (let j = 0; j < n; j++) {
        if (visited[j]) continue;
        if (euclideanDist(agents[cur], agents[j]) < threshold) {
          visited[j] = 1;
          queue.push(j);
        }
      }
    }
  }

  return clusters;
}

function computeVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
}

export function computeStats(agents: Agent[], step: number): SimulationStats {
  const n = agents.length;
  if (n === 0) {
    return {
      step,
      clusterCount: 0,
      polarizationIndex: 0,
      axisMeans: [0, 0, 0],
      axisSpreads: [0, 0, 0],
      quadrantCounts: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
      zoneCounts: { center: 0, edges: 0, corners: 0 },
    };
  }

  // Per-axis stats
  const axisMeans: [number, number, number] = [0, 0, 0];
  const axisSpreads: [number, number, number] = [0, 0, 0];

  for (let a = 0; a < 3; a++) {
    const values = agents.map((ag) => ag.beliefs[a]);
    axisMeans[a] = values.reduce((s, v) => s + v, 0) / n;
    axisSpreads[a] = Math.sqrt(computeVariance(values));
  }

  // Polarization: normalized average variance across axes
  // Max variance for uniform [-1,1] is 1/3
  const avgVariance =
    (axisSpreads[0] ** 2 + axisSpreads[1] ** 2 + axisSpreads[2] ** 2) / 3;
  const polarizationIndex = Math.min(avgVariance / (1 / 3), 1);

  // Quadrant counts (using x,y axes)
  const quadrantCounts = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
  for (const agent of agents) {
    const x = agent.beliefs[0];
    const y = agent.beliefs[1];
    if (x < 0 && y >= 0) quadrantCounts.topLeft++;
    else if (x >= 0 && y >= 0) quadrantCounts.topRight++;
    else if (x < 0 && y < 0) quadrantCounts.bottomLeft++;
    else quadrantCounts.bottomRight++;
  }

  // Zone counts: center (|x|<0.5 & |y|<0.5), corners (|x|>0.7 & |y|>0.7), edges (rest with |x|>0.7 or |y|>0.7)
  const zoneCounts = { center: 0, edges: 0, corners: 0 };
  for (const agent of agents) {
    const ax = Math.abs(agent.beliefs[0]);
    const ay = Math.abs(agent.beliefs[1]);
    if (ax < 0.5 && ay < 0.5) {
      zoneCounts.center++;
    } else if (ax > 0.7 && ay > 0.7) {
      zoneCounts.corners++;
    } else if (ax > 0.7 || ay > 0.7) {
      zoneCounts.edges++;
    }
    // agents in the "transition" zone (0.5-0.7, not on edge) are uncounted
  }

  // Cluster count (subsample for performance with large agent counts)
  const sampleSize = Math.min(n, 200);
  let sampleAgents = agents;
  if (n > sampleSize) {
    const shuffled = [...agents];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    sampleAgents = shuffled.slice(0, sampleSize);
  }
  const clusterCount = countClusters(sampleAgents);

  return {
    step,
    clusterCount,
    polarizationIndex,
    axisMeans,
    axisSpreads,
    quadrantCounts,
    zoneCounts,
  };
}
