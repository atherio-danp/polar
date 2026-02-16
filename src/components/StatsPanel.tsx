"use client";

import type { SimulationStats } from "@/simulation/types";
import { AXIS_LABELS, QUADRANT_LABELS } from "@/lib/constants";

interface StatsPanelProps {
  stats: SimulationStats;
}

function BarIndicator({ value, label }: { value: number; label: string }) {
  // value is [-1, 1], we show it as a bar from center
  const pct = ((value + 1) / 2) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-500 font-mono">{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full relative">
        {/* Center mark */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-slate-500" />
        {/* Value indicator */}
        <div
          className="absolute top-0 h-full bg-violet-500 rounded-full"
          style={{
            left: `${Math.min(pct, 50)}%`,
            width: `${Math.abs(pct - 50)}%`,
          }}
        />
      </div>
    </div>
  );
}

function SpreadIndicator({ spread, label }: { spread: number; label: string }) {
  // spread 0–1 (std dev, normalized)
  const pct = Math.min(spread, 1) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-slate-400">{label} spread</span>
        <span className="text-slate-500 font-mono">{spread.toFixed(2)}</span>
      </div>
      <div className="h-1 bg-slate-700 rounded-full">
        <div
          className="h-full bg-cyan-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="p-4 space-y-4 text-sm">
      <h3 className="text-xs uppercase tracking-wider text-slate-500">
        What's Happening
      </h3>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500">Time</div>
          <div className="text-lg font-mono text-slate-200">{stats.step}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500">Groups</div>
          <div className="text-lg font-mono text-slate-200">
            {stats.clusterCount}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2.5 col-span-2">
          <div className="text-xs text-slate-500">How Divided</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-700 rounded-full">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(stats.polarizationIndex * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              {stats.polarizationIndex.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Per-axis means */}
      <div>
        <h4 className="text-xs text-slate-500 mb-2">Average Opinion</h4>
        {AXIS_LABELS.map((axis, i) => (
          <BarIndicator
            key={i}
            value={stats.axisMeans[i]}
            label={`${axis.negative} ↔ ${axis.positive}`}
          />
        ))}
      </div>

      {/* Per-axis spreads */}
      <div>
        <h4 className="text-xs text-slate-500 mb-2">How Spread Out</h4>
        {AXIS_LABELS.map((axis, i) => (
          <SpreadIndicator
            key={i}
            spread={stats.axisSpreads[i]}
            label={axis.positive}
          />
        ))}
      </div>

      {/* Zone populations */}
      <div>
        <h4 className="text-xs text-slate-500 mb-2">Where Are People?</h4>
        <div className="space-y-1.5 text-xs">
          {([
            { key: "center" as const, label: "Moderates", desc: "near the middle", color: "bg-emerald-500" },
            { key: "edges" as const, label: "Leaning", desc: "strong on one issue", color: "bg-amber-500" },
            { key: "corners" as const, label: "Extreme", desc: "strong on multiple issues", color: "bg-red-500" },
          ]).map(({ key, label, desc, color }) => {
            const zones = stats.zoneCounts ?? { center: 0, edges: 0, corners: 0 };
            const count = zones[key];
            const total = zones.center + zones.edges + zones.corners;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={key} className="bg-slate-800/50 rounded px-2.5 py-1.5">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{label} <span className="text-slate-600">{desc}</span></span>
                  <span className="text-slate-300 font-mono">{count}</span>
                </div>
                <div className="h-1 bg-slate-700 rounded-full">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quadrant populations */}
      <div>
        <h4 className="text-xs text-slate-500 mb-2">Political Camps</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {(
            Object.entries(QUADRANT_LABELS) as [
              keyof typeof QUADRANT_LABELS,
              string,
            ][]
          ).map(([key, label]) => (
            <div
              key={key}
              className="bg-slate-800/50 rounded px-2 py-1.5 flex justify-between"
            >
              <span className="text-slate-400 truncate mr-2">{label}</span>
              <span className="text-slate-300 font-mono">
                {stats.quadrantCounts[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
