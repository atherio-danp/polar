"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulationStats, SimulationConfig, Insight } from "@/simulation/types";
import { getPresetById } from "@/lib/presets";

interface StatsSnapshot {
  step: number;
  polarizationIndex: number;
  clusterCount: number;
  axisMeans: [number, number, number];
  axisSpreads: [number, number, number];
  center: number;
  edges: number;
  corners: number;
}

interface Trends {
  sinceStart: {
    polarizationDelta: number;
    meansDrift: [number, number, number];
    centerLost: number;
    cornersGained: number;
  };
  recent: {
    polarizationDelta: number;
    clusterDelta: number;
    meansDrift: [number, number, number];
    spreadsDelta: [number, number, number];
    centerDelta: number;
    cornersDelta: number;
  };
  rateOfChange: number;
}

function toSnapshot(stats: SimulationStats): StatsSnapshot {
  return {
    step: stats.step,
    polarizationIndex: round(stats.polarizationIndex),
    clusterCount: stats.clusterCount,
    axisMeans: stats.axisMeans.map(round) as [number, number, number],
    axisSpreads: stats.axisSpreads.map(round) as [number, number, number],
    center: stats.zoneCounts.center,
    edges: stats.zoneCounts.edges,
    corners: stats.zoneCounts.corners,
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function computeTrends(
  initial: StatsSnapshot,
  history: StatsSnapshot[],
  recent: StatsSnapshot[],
  current: StatsSnapshot
): Trends {
  // Find a reference point ~200 steps ago
  const refPoint =
    history.length > 0
      ? history[history.length - 1]
      : initial;

  const sinceStart = {
    polarizationDelta: round(current.polarizationIndex - initial.polarizationIndex),
    meansDrift: current.axisMeans.map((m, i) =>
      round(m - initial.axisMeans[i])
    ) as [number, number, number],
    centerLost: initial.center - current.center,
    cornersGained: current.corners - initial.corners,
  };

  const recentTrends = {
    polarizationDelta: round(current.polarizationIndex - refPoint.polarizationIndex),
    clusterDelta: current.clusterCount - refPoint.clusterCount,
    meansDrift: current.axisMeans.map((m, i) =>
      round(m - refPoint.axisMeans[i])
    ) as [number, number, number],
    spreadsDelta: current.axisSpreads.map((s, i) =>
      round(s - refPoint.axisSpreads[i])
    ) as [number, number, number],
    centerDelta: current.center - refPoint.center,
    cornersDelta: current.corners - refPoint.corners,
  };

  // Rate of change: magnitude of change across last 3 snapshots
  let rateOfChange = 0;
  if (recent.length >= 2) {
    const prev = recent[recent.length - 2];
    const curr = recent[recent.length - 1];
    const polDelta = Math.abs(curr.polarizationIndex - prev.polarizationIndex);
    const centerDelta = Math.abs(curr.center - prev.center);
    const cornerDelta = Math.abs(curr.corners - prev.corners);
    const meanDelta = curr.axisMeans.reduce(
      (sum, m, i) => sum + Math.abs(m - prev.axisMeans[i]),
      0
    );
    // Normalize: pol is 0-1, center/corners are 0-agentCount, means are -1 to 1
    rateOfChange = round(
      polDelta * 10 + (centerDelta + cornerDelta) * 0.05 + meanDelta * 2
    );
  }

  return { sinceStart, recent: recentTrends, rateOfChange };
}

const MAX_INSIGHTS = 30;
const HISTORY_INTERVAL = 200; // steps between subsampled history snapshots
const RECENT_INTERVAL = 10; // steps between recent buffer updates
const MIN_STEPS_BETWEEN_CALLS = 200;
const UNCONDITIONAL_INTERVAL = 500;
const CHANGE_THRESHOLD = 0.5;
const EARLY_FIRE_STEP = 5;

export function useInsights(
  stats: SimulationStats,
  config: SimulationConfig,
  playing: boolean,
  activePresetId: string | null
) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const initialRef = useRef<StatsSnapshot | null>(null);
  const historyRef = useRef<StatsSnapshot[]>([]);
  const recentRef = useRef<StatsSnapshot[]>([]);
  const lastHistoryStepRef = useRef(0);
  const lastRecentStepRef = useRef(0);
  const lastCallStepRef = useRef(-1);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const insightIdRef = useRef(0);
  const earlyFiredRef = useRef(false);

  // Refs for values read inside the trigger effect (avoids unstable dep array)
  const insightsRef = useRef(insights);
  insightsRef.current = insights;
  const configRef = useRef(config);
  configRef.current = config;
  const presetIdRef = useRef(activePresetId);
  presetIdRef.current = activePresetId;

  // Capture initial snapshot
  useEffect(() => {
    if (stats.step === 0 || initialRef.current === null) {
      initialRef.current = toSnapshot(stats);
      historyRef.current = [];
      recentRef.current = [];
      lastHistoryStepRef.current = 0;
      lastRecentStepRef.current = 0;
      lastCallStepRef.current = -1;
      earlyFiredRef.current = false;
    }
  }, [stats.step === 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset on step 0 (full reset)
  const resetInsights = useCallback(() => {
    initialRef.current = null;
    historyRef.current = [];
    recentRef.current = [];
    lastHistoryStepRef.current = 0;
    lastRecentStepRef.current = 0;
    lastCallStepRef.current = -1;
    earlyFiredRef.current = false;
    setInsights([]);
    setLoading(false);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    pendingRef.current = false;
  }, []);

  // Update snapshot buffers
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = toSnapshot(stats);
    }

    const step = stats.step;

    // Update history buffer (every HISTORY_INTERVAL steps)
    if (step - lastHistoryStepRef.current >= HISTORY_INTERVAL && step > 0) {
      historyRef.current = [...historyRef.current, toSnapshot(stats)];
      lastHistoryStepRef.current = step;
    }

    // Update recent buffer (every RECENT_INTERVAL steps, keep last 3)
    if (step - lastRecentStepRef.current >= RECENT_INTERVAL && step > 0) {
      const recent = [...recentRef.current, toSnapshot(stats)];
      recentRef.current = recent.slice(-3);
      lastRecentStepRef.current = step;
    }
  }, [stats]);

  // Trigger API calls
  useEffect(() => {
    if (!enabled || !playing || pendingRef.current || !initialRef.current) return;

    const step = stats.step;
    const stepsSinceLastCall = step - lastCallStepRef.current;

    // Early fire for initial conditions
    const shouldEarlyFire =
      !earlyFiredRef.current && step >= EARLY_FIRE_STEP && lastCallStepRef.current < 0;

    // Minimum step gap
    if (!shouldEarlyFire && stepsSinceLastCall < MIN_STEPS_BETWEEN_CALLS) return;

    const current = toSnapshot(stats);
    const trends = computeTrends(
      initialRef.current,
      historyRef.current,
      recentRef.current,
      current
    );

    // Check if we should fire
    const shouldFire =
      shouldEarlyFire ||
      trends.rateOfChange > CHANGE_THRESHOLD ||
      stepsSinceLastCall >= UNCONDITIONAL_INTERVAL;

    if (!shouldFire) return;

    if (shouldEarlyFire) earlyFiredRef.current = true;
    lastCallStepRef.current = step;
    pendingRef.current = true;
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Get last 2 insight texts
    const currentInsights = insightsRef.current;
    const prevInsightTexts = currentInsights.slice(-2).map((i) => i.text);

    // Compact config for the API
    const cfg = configRef.current;
    const compactConfig = {
      agentCount: cfg.agentCount,
      baseTolerance: cfg.baseTolerance,
      attractionRate: cfg.attractionRate,
      rejectionRate: cfg.rejectionRate,
      peerInfluenceRatio: cfg.peerInfluenceRatio,
      confirmationBias: cfg.confirmationBias,
      confidenceSpread: cfg.confidenceSpread,
      initialCorrelation: cfg.initialCorrelation,
      messageMode: cfg.messageMode,
      mediaSources: cfg.mediaSources
        .filter((s) => s.enabled)
        .map((s) => ({ label: s.label, beliefs: s.beliefs, reach: s.reach })),
    };

    // Resolve preset metadata
    const currentPresetId = presetIdRef.current;
    const activePreset = currentPresetId ? getPresetById(currentPresetId) : null;
    const presetInfo = activePreset
      ? { id: activePreset.id, name: activePreset.name, description: activePreset.description }
      : null;

    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        initial: initialRef.current,
        history: historyRef.current,
        recent: recentRef.current,
        trends,
        config: compactConfig,
        preset: presetInfo,
        previousInsights: prevInsightTexts,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.insight) {
          const newInsight: Insight = {
            id: ++insightIdRef.current,
            step,
            text: data.insight,
            timestamp: Date.now(),
          };
          setInsights((prev) => [...prev.slice(-(MAX_INSIGHTS - 1)), newInsight]);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Insight fetch failed:", err);
        }
      })
      .finally(() => {
        pendingRef.current = false;
        setLoading(false);
        abortRef.current = null;
      });
  }, [stats, playing, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return {
    insights,
    loading,
    enabled,
    toggleEnabled,
    resetInsights,
  };
}
