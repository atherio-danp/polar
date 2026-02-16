"use client";

import type { Insight } from "@/simulation/types";

interface InsightPanelProps {
  insights: Insight[];
  loading: boolean;
  enabled: boolean;
  onToggle: () => void;
}

export default function InsightPanel({
  insights,
  loading,
  enabled,
  onToggle,
}: InsightPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-wider text-slate-500">
          AI Commentary
        </h3>
        <button
          onClick={onToggle}
          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
            enabled
              ? "bg-violet-500/20 text-violet-400"
              : "bg-slate-700/50 text-slate-500"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      {!enabled ? (
        <p className="text-xs text-slate-600 italic">
          AI commentary is disabled
        </p>
      ) : insights.length === 0 && !loading ? (
        <p className="text-xs text-slate-600 italic">
          Press Play — commentary will appear as the simulation runs
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-violet-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Analyzing...
            </div>
          )}
          {[...insights].reverse().map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-800/50 rounded-lg p-3 text-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  step {insight.step}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
