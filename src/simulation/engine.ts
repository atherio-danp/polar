import type { Agent, Message, SimulationConfig, SimulationState } from "./types";

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomAxis(): 0 | 1 | 2 {
  return randInt(3) as 0 | 1 | 2;
}

function createAgent(id: number, confidenceSpread: number, initialCorrelation: number): Agent {
  // confidence distributed around 0.5 with spread controlling variance
  const base = 0.5;
  const variance = confidenceSpread * 0.5;
  const confidence = clamp(base + randRange(-variance, variance), 0, 1);

  // Correlated initialization:
  // At correlation=0: all axes independent
  // At correlation=1: axes fully determined by a shared "ideological leaning"
  // The two common real-world clusters:
  //   Traditional (-) + Security (+) + Merit (+)   [conservative]
  //   Progressive (+) + Freedom (-) + Equality (-) [progressive]
  // So axis 0 (tradition↔progress) correlates positively with axis 2 (equality↔merit)
  // and negatively with axis 1 (freedom↔security)
  const independent = [randRange(-1, 1), randRange(-1, 1), randRange(-1, 1)];
  const leaning = randRange(-1, 1); // shared ideological seed
  const c = initialCorrelation;

  const beliefs: [number, number, number] = [
    clamp(independent[0] * (1 - c) + leaning * c, -1, 1),          // tradition↔progress follows leaning
    clamp(independent[1] * (1 - c) + (-leaning) * c, -1, 1),       // freedom↔security inverts (progressive→free)
    clamp(independent[2] * (1 - c) + leaning * c, -1, 1),          // equality↔merit follows leaning
  ];

  return { id, beliefs, confidence };
}

export function createInitialState(config: SimulationConfig): SimulationState {
  const agents: Agent[] = [];
  for (let i = 0; i < config.agentCount; i++) {
    agents.push(createAgent(i, config.confidenceSpread, config.initialCorrelation));
  }
  return { agents, step: 0, config };
}

function generateEnvironmentalMessage(
  mode: SimulationConfig["messageMode"]
): Message {
  const axis = randomAxis();
  let value: number;

  switch (mode) {
    case "random":
      value = randRange(-1, 1);
      break;
    case "polarized":
      // Messages tend toward extremes
      value = Math.random() < 0.5 ? randRange(-1, -0.3) : randRange(0.3, 1);
      break;
    case "moderate":
      // Messages cluster near center
      value = randRange(-0.4, 0.4);
      break;
  }

  return { axis, value: clamp(value, -1, 1) };
}

function applyMessage(
  agent: Agent,
  message: Message,
  config: SimulationConfig
): Agent {
  const { axis, value: m } = message;
  const current = agent.beliefs[axis];
  const d = Math.abs(m - current);
  const tau = config.baseTolerance * (1 - agent.confidence);

  let alpha = config.attractionRate;
  const beta = config.rejectionRate;

  // Confirmation bias: adjust alpha based on whether message is on same side
  if (config.confirmationBias > 0) {
    const sameSide =
      (current >= 0 && m >= 0) || (current < 0 && m < 0);
    if (sameSide) {
      alpha = alpha * (1 + config.confirmationBias);
    } else {
      alpha = alpha * (1 - config.confirmationBias * 0.5);
    }
  }

  const newBeliefs: [number, number, number] = [
    agent.beliefs[0],
    agent.beliefs[1],
    agent.beliefs[2],
  ];

  if (d <= tau) {
    // Attraction
    newBeliefs[axis] = clamp(current + alpha * (m - current), -1, 1);
  } else {
    // Rejection
    newBeliefs[axis] = clamp(current - beta * (m - current), -1, 1);
  }

  return { ...agent, beliefs: newBeliefs };
}

export function step(state: SimulationState): SimulationState {
  const { config } = state;
  let agents = state.agents.map((a) => ({
    ...a,
    beliefs: [...a.beliefs] as [number, number, number],
  }));

  const peerCount = Math.floor(
    config.interactionsPerStep * config.peerInfluenceRatio
  );
  const envCount = config.interactionsPerStep - peerCount;

  // Peer interactions: random pairs
  for (let i = 0; i < peerCount; i++) {
    const idxA = randInt(agents.length);
    let idxB = randInt(agents.length);
    // Ensure different agents
    if (idxB === idxA) idxB = (idxA + 1) % agents.length;

    const axis = randomAxis();
    // A's belief → message for B, and vice versa
    const msgForB: Message = { axis, value: agents[idxA].beliefs[axis] };
    const msgForA: Message = { axis, value: agents[idxB].beliefs[axis] };

    agents[idxB] = applyMessage(agents[idxB], msgForB, config);
    agents[idxA] = applyMessage(agents[idxA], msgForA, config);
  }

  // Environmental messages
  for (let i = 0; i < envCount; i++) {
    const msg = generateEnvironmentalMessage(config.messageMode);
    const idx = randInt(agents.length);
    agents[idx] = applyMessage(agents[idx], msg, config);
  }

  // Media sources
  for (const source of config.mediaSources) {
    if (!source.enabled) continue;
    const exposedCount = Math.floor(source.reach * agents.length);
    for (let i = 0; i < exposedCount; i++) {
      const idx = randInt(agents.length);
      const axis = randomAxis();
      const msg: Message = { axis, value: source.beliefs[axis] };
      agents[idx] = applyMessage(agents[idx], msg, config);
    }
  }

  return {
    agents,
    step: state.step + 1,
    config: state.config,
  };
}
