"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulationConfig, SimulationState } from "@/simulation/types";
import type { SimulationStats } from "@/simulation/types";
import { createInitialState, step } from "@/simulation/engine";
import { computeStats } from "@/simulation/analysis";
import { DEFAULT_CONFIG } from "@/lib/constants";

export function useSimulation() {
  const [config, setConfig] = useState<SimulationConfig>({
    ...DEFAULT_CONFIG,
    mediaSources: DEFAULT_CONFIG.mediaSources.map((s) => ({ ...s })),
  });
  const [state, setState] = useState<SimulationState>(() =>
    createInitialState(config)
  );
  const [stats, setStats] = useState<SimulationStats>(() =>
    computeStats(state.agents, state.step)
  );
  const [playing, setPlaying] = useState(false);

  const stateRef = useRef(state);
  const configRef = useRef(config);
  const playingRef = useRef(playing);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  stateRef.current = state;
  configRef.current = config;
  playingRef.current = playing;

  // Animation loop
  useEffect(() => {
    if (!playing) return;

    let running = true;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      if (!running) return;

      const interval = 1000 / configRef.current.simulationSpeed;
      const elapsed = now - lastTickRef.current;

      if (elapsed >= interval) {
        const stepsToRun = Math.min(
          Math.floor(elapsed / interval),
          3 // cap catch-up to prevent freezing
        );
        let current = stateRef.current;
        for (let i = 0; i < stepsToRun; i++) {
          current = step({ ...current, config: configRef.current });
        }
        stateRef.current = current;
        setState(current);
        setStats(computeStats(current.agents, current.step));
        lastTickRef.current = now - (elapsed % interval);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  const stepOnce = useCallback(() => {
    const next = step({ ...stateRef.current, config: configRef.current });
    stateRef.current = next;
    setState(next);
    setStats(computeStats(next.agents, next.step));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    const newState = createInitialState(configRef.current);
    stateRef.current = newState;
    setState(newState);
    setStats(computeStats(newState.agents, newState.step));
  }, []);

  const updateConfig = useCallback(
    (updates: Partial<SimulationConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...updates };
        configRef.current = next;
        return next;
      });
    },
    []
  );

  return {
    state,
    config,
    stats,
    playing,
    play,
    pause,
    stepOnce,
    reset,
    updateConfig,
  };
}
