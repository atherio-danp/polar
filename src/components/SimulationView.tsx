"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { useInsights } from "@/hooks/useInsights";
import Canvas2D from "./Canvas2D";
import ControlPanel from "./ControlPanel";
import StatsPanel from "./StatsPanel";
import Logo from "./Logo";
import type { Preset } from "@/lib/presets";

export default function SimulationView() {
  const {
    state,
    config,
    stats,
    playing,
    play,
    pause,
    stepOnce,
    reset,
    updateConfig,
  } = useSimulation();

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const {
    insights,
    loading: insightsLoading,
    enabled: insightsEnabled,
    toggleEnabled: toggleInsights,
    resetInsights,
  } = useInsights(stats, config, playing, activePreset);

  const handleSelectPreset = useCallback(
    (preset: Preset) => {
      setActivePreset(preset.id);
      const speed = config.simulationSpeed;
      updateConfig({
        ...preset.config,
        simulationSpeed: speed,
        mediaSources: preset.config.mediaSources.map((s) => ({ ...s })),
      });
      setTimeout(() => {
        reset();
        resetInsights();
      }, 0);
    },
    [config.simulationSpeed, updateConfig, reset, resetInsights]
  );

  const handleReset = useCallback(() => {
    reset();
    resetInsights();
  }, [reset, resetInsights]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      setCanvasSize({ width: rect.width, height: Math.max(size, 400) });
    }
  }, []);

  useEffect(() => {
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateSize]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100">
      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 min-h-[400px] relative">
        <Canvas2D
          state={state}
          width={canvasSize.width}
          height={canvasSize.height}
        />
      </div>

      {/* Right sidebar: Controls + Stats */}
      <div className="w-full md:w-96 lg:w-[28rem] border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 overflow-y-auto max-h-screen">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <h1 className="text-lg font-semibold text-slate-100">Polar</h1>
          </div>
          <p className="text-sm text-slate-300 mt-1">Watch how opinions form, spread, and divide</p>
        </div>
        <ControlPanel
          config={config}
          playing={playing}
          activePreset={activePreset}
          onSelectPreset={handleSelectPreset}
          onUpdate={updateConfig}
          onPlay={play}
          onPause={pause}
          onStep={stepOnce}
          onReset={handleReset}
          insights={insights}
          insightsLoading={insightsLoading}
          insightsEnabled={insightsEnabled}
          onToggleInsights={toggleInsights}
        />
        <div className="border-t border-slate-800">
          <StatsPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}
