"use client";

import { useState } from "react";
import type { SimulationConfig, MediaSource, Insight } from "@/simulation/types";
import { LIMITS, RESET_PARAMS } from "@/lib/constants";
import { PRESETS, type Preset } from "@/lib/presets";
import InsightPanel from "./InsightPanel";

interface ControlPanelProps {
  config: SimulationConfig;
  playing: boolean;
  activePreset: string | null;
  onSelectPreset: (preset: Preset) => void;
  onUpdate: (updates: Partial<SimulationConfig>) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  insights: Insight[];
  insightsLoading: boolean;
  insightsEnabled: boolean;
  onToggleInsights: () => void;
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  format,
  needsReset,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  needsReset?: boolean;
}) {
  const safeValue = value ?? min;
  const display = format ? format(safeValue) : safeValue.toFixed(2);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">
          {label}
          {needsReset && (
            <span className="text-amber-500 ml-1" title="Press Reset after changing">
              *
            </span>
          )}
        </span>
        <span className="text-slate-400 font-mono">{display}</span>
      </div>
      {hint && <p className="text-xs leading-normal text-slate-400 mb-1.5">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
      />
    </div>
  );
}

function MediaSourceControl({
  source,
  onChange,
}: {
  source: MediaSource;
  onChange: (updated: MediaSource) => void;
}) {
  return (
    <div className="border border-slate-700 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{source.label}</span>
        <button
          onClick={() => onChange({ ...source, enabled: !source.enabled })}
          className={`px-2 py-0.5 text-xs rounded ${
            source.enabled
              ? "bg-violet-600 text-white"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {source.enabled ? "ON" : "OFF"}
        </button>
      </div>
      {source.enabled && (
        <Slider
          label="Audience"
          value={source.reach}
          min={LIMITS.mediaReach.min}
          max={LIMITS.mediaReach.max}
          step={LIMITS.mediaReach.step}
          onChange={(v) => onChange({ ...source, reach: v })}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      )}
    </div>
  );
}

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs uppercase tracking-wider text-slate-500 hover:text-slate-400 transition-colors mb-2"
      >
        <span>{title}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mb-1">{children}</div>}
    </div>
  );
}

export default function ControlPanel({
  config,
  playing,
  activePreset,
  onSelectPreset,
  onUpdate,
  onPlay,
  onPause,
  onStep,
  onReset,
  insights,
  insightsLoading,
  insightsEnabled,
  onToggleInsights,
}: ControlPanelProps) {
  const hasPreset = activePreset !== null;
  const selectedPreset = PRESETS.find((p) => p.id === activePreset);

  const updateMediaSource = (index: number, updated: MediaSource) => {
    const newSources = config.mediaSources.map((s, i) =>
      i === index ? updated : s
    );
    onUpdate({ mediaSources: newSources });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 text-sm">
      {/* Preset Selector */}
      <div>
        <select
          value={activePreset ?? ""}
          onChange={(e) => {
            const preset = PRESETS.find((p) => p.id === e.target.value);
            if (preset) onSelectPreset(preset);
          }}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm appearance-none cursor-pointer focus:outline-none focus:border-violet-500 transition-colors"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
        >
          <option value="" disabled>Choose a society...</option>
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} — {preset.tagline}
            </option>
          ))}
        </select>
        {selectedPreset && (
          <div className="bg-slate-800/50 rounded-lg p-3 mt-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPreset.description}
            </p>
          </div>
        )}
      </div>

      {/* Transport */}
      <div className="flex gap-2">
        {!hasPreset ? (
          <div className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 text-slate-500 text-center text-xs">
            Select a society to begin
          </div>
        ) : (
          <button
            onClick={playing ? onPause : onPlay}
            className="flex-1 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            {playing ? "Pause" : "Play"}
          </button>
        )}
        <button
          onClick={onStep}
          disabled={playing || !hasPreset}
          className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Step
        </button>
        <button
          onClick={onReset}
          disabled={!hasPreset}
          className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>

      {/* AI Commentary — right below transport */}
      <InsightPanel
        insights={insights}
        loading={insightsLoading}
        enabled={insightsEnabled}
        onToggle={onToggleInsights}
      />

      {/* Speed — always visible */}
      <Slider
        label="Speed"
        value={config.simulationSpeed}
        {...LIMITS.simulationSpeed}
        onChange={(v) => onUpdate({ simulationSpeed: v })}
        format={(v) => `${Math.round(v)} sps`}
      />

      {/* Fine-tune sections — collapsible */}
      <Section title="Population">
        <Slider
          label="People"
          hint="How many individuals in the simulation"
          value={config.agentCount}
          {...LIMITS.agentCount}
          onChange={(v) => onUpdate({ agentCount: v })}
          format={(v) => String(Math.round(v))}
          needsReset={RESET_PARAMS.includes("agentCount")}
        />
        <Slider
          label="Stubbornness Variety"
          hint="How much people differ in how set-in-their-ways they are"
          value={config.confidenceSpread}
          {...LIMITS.confidenceSpread}
          onChange={(v) => onUpdate({ confidenceSpread: v })}
          needsReset={RESET_PARAMS.includes("confidenceSpread")}
        />
        <Slider
          label="Political Alignment"
          hint="How bundled views start — high = left vs right camps, low = random mix"
          value={config.initialCorrelation}
          {...LIMITS.initialCorrelation}
          onChange={(v) => onUpdate({ initialCorrelation: v })}
          needsReset={RESET_PARAMS.includes("initialCorrelation")}
        />
      </Section>

      <Section title="How People React">
        <Slider
          label="Open-mindedness"
          hint="How far apart views can be before someone stops listening"
          value={config.baseTolerance}
          {...LIMITS.baseTolerance}
          onChange={(v) => onUpdate({ baseTolerance: v })}
        />
        <Slider
          label="Persuadability"
          hint="How much people move toward views they're willing to hear"
          value={config.attractionRate}
          {...LIMITS.attractionRate}
          onChange={(v) => onUpdate({ attractionRate: v })}
        />
        <Slider
          label="Pushback"
          hint="How much people push away from views they reject"
          value={config.rejectionRate}
          {...LIMITS.rejectionRate}
          onChange={(v) => onUpdate({ rejectionRate: v })}
          format={(v) => v.toFixed(3)}
        />
        <Slider
          label="Echo Chamber"
          hint="People absorb agreeable views faster and discount opposing ones"
          value={config.confirmationBias}
          {...LIMITS.confirmationBias}
          onChange={(v) => onUpdate({ confirmationBias: v })}
        />
      </Section>

      <Section title="Information Sources">
        <Slider
          label="Conversations vs News"
          hint="Left = mostly media influence, right = mostly talking to each other"
          value={config.peerInfluenceRatio}
          {...LIMITS.peerInfluenceRatio}
          onChange={(v) => onUpdate({ peerInfluenceRatio: v })}
          format={(v) =>
            v >= 0.95 ? "All talk" : v <= 0.05 ? "All news" : `${Math.round(v * 100)}% talk`
          }
        />
      </Section>

      <Section title="News Climate">
        <p className="text-xs text-slate-400 mb-2">What kind of information is in the air?</p>
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          {([
            { key: "random" as const, label: "Mixed" },
            { key: "polarized" as const, label: "Outrage" },
            { key: "moderate" as const, label: "Balanced" },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onUpdate({ messageMode: key })}
              className={`flex-1 px-2 py-1.5 text-xs transition-colors ${
                config.messageMode === key
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Media Channels">
        <p className="text-xs text-slate-400 mb-2">Persistent voices that broadcast but never listen</p>
        {config.mediaSources.map((source, i) => (
          <MediaSourceControl
            key={source.id}
            source={source}
            onChange={(updated) => updateMediaSource(i, updated)}
          />
        ))}
      </Section>

      {/* Legend */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>
          <span className="text-amber-500">*</span> Press Reset after changing
        </p>
        <p>
          Bigger, brighter dots = more stubborn people
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1 align-middle" />
          Share equally
          <span className="mx-1">↔</span>
          <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1 align-middle" />
          Earn your own
        </p>
      </div>
    </div>
  );
}
