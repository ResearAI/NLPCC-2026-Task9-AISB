"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";

type Track = "T1" | "T2" | "T3" | "Overall";

interface LeaderboardEntry {
  rank: number;
  team: string;
  system: string;
  autonomy: "auto" | "human";
  score: number;
  cas: number;
  cost: string;
  integrity: "PASS" | "FLAGGED" | "FAIL";
  dualScore: number;
}

const DATA: Record<Track, LeaderboardEntry[]> = {
  T1: [
    { rank: 1, team: "AISB Baseline", system: "Direct CoT", autonomy: "auto", score: 42.3, cas: 0.91, cost: "$8.20", integrity: "PASS", dualScore: 38.5 },
    { rank: 2, team: "AutoResearch", system: "GPT-4o Agent", autonomy: "auto", score: 56.8, cas: 0.62, cost: "$18.50", integrity: "FLAGGED", dualScore: 35.2 },
    { rank: 3, team: "DeepScientist", system: "Claude Opus + RAG", autonomy: "human", score: 61.2, cas: 0.31, cost: "$22.10", integrity: "FAIL", dualScore: 19.0 },
  ],
  T2: [
    { rank: 1, team: "AISB Baseline", system: "DeepSeek-Prover-V2", autonomy: "auto", score: 28.0, cas: 1.00, cost: "$12.40", integrity: "PASS", dualScore: 28.0 },
    { rank: 2, team: "AutoResearch", system: "Lean4 + GPT-4o", autonomy: "auto", score: 34.0, cas: 0.88, cost: "$19.80", integrity: "PASS", dualScore: 29.9 },
    { rank: 3, team: "DeepScientist", system: "AlphaProof-lite", autonomy: "human", score: 40.0, cas: 0.45, cost: "$25.60", integrity: "FLAGGED", dualScore: 18.0 },
  ],
  T3: [
    { rank: 1, team: "AISB Baseline", system: "RF + XGBoost", autonomy: "auto", score: 45.2, cas: 0.95, cost: "$5.10", integrity: "PASS", dualScore: 42.9 },
    { rank: 2, team: "AutoResearch", system: "AutoML Agent", autonomy: "auto", score: 58.7, cas: 0.72, cost: "$16.90", integrity: "PASS", dualScore: 42.3 },
    { rank: 3, team: "DeepScientist", system: "GNN + LLM", autonomy: "human", score: 63.1, cas: 0.28, cost: "$21.30", integrity: "FAIL", dualScore: 17.7 },
  ],
  Overall: [
    { rank: 1, team: "AISB Baseline", system: "Ensemble", autonomy: "auto", score: 38.5, cas: 0.95, cost: "$25.70", integrity: "PASS", dualScore: 36.6 },
    { rank: 2, team: "AutoResearch", system: "Multi-Agent", autonomy: "auto", score: 49.8, cas: 0.74, cost: "$55.20", integrity: "FLAGGED", dualScore: 36.9 },
    { rank: 3, team: "DeepScientist", system: "Full Pipeline", autonomy: "human", score: 54.8, cas: 0.35, cost: "$69.00", integrity: "FAIL", dualScore: 19.2 },
  ],
};

const TRACK_TABS: { key: Track; label: string; color: string }[] = [
  { key: "Overall", label: "Overall", color: "var(--navy-700)" },
  { key: "T1", label: "T1: LM Reasoning", color: "var(--gold-500)" },
  { key: "T2", label: "T2: Math & Proof", color: "var(--violet-500)" },
  { key: "T3", label: "T3: Discovery", color: "var(--emerald-500)" },
];

function integrityStyle(status: string) {
  switch (status) {
    case "PASS":
      return "bg-[var(--emerald-500)]/10 text-[var(--emerald-500)]";
    case "FLAGGED":
      return "bg-[var(--gold-500)]/10 text-[var(--gold-500)]";
    case "FAIL":
      return "bg-[var(--red-500)]/10 text-[var(--red-500)]";
    default:
      return "";
  }
}

function casColor(cas: number) {
  if (cas >= 0.8) return "text-[var(--emerald-500)]";
  if (cas >= 0.5) return "text-[var(--gold-500)]";
  return "text-[var(--red-500)]";
}

export default function LeaderboardPage() {
  const [activeTrack, setActiveTrack] = useState<Track>("Overall");
  const [sortBy, setSortBy] = useState<"dualScore" | "score" | "cas" | "cost">(
    "dualScore"
  );
  const [autonomyFilter, setAutonomyFilter] = useState<"all" | "auto" | "human">("all");

  const filtered = DATA[activeTrack].filter(
    (e) => autonomyFilter === "all" || e.autonomy === autonomyFilter
  );
  const entries = [...filtered].sort((a, b) => {
    if (sortBy === "cost") {
      return parseFloat(a.cost.slice(1)) - parseFloat(b.cost.slice(1));
    }
    return b[sortBy] - a[sortBy];
  });

  // Re-rank after sort
  const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="Leaderboard"
        subtitle="Rankings across all competition tracks. Sorted by Dual Score (performance x integrity) by default."
      />

      {/* Track Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TRACK_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTrack(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTrack === tab.key
                ? "bg-gray-50 border border-white/[0.12]"
                : "text-[var(--gray-400)] hover:text-[var(--gray-500)]"
            }`}
            style={
              activeTrack === tab.key ? { color: tab.color } : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Autonomy Filter */}
      <div className="flex gap-2 mb-4">
        <span className="text-xs text-[var(--gray-400)] self-center mr-2">Award Category:</span>
        {([["all", "All"], ["auto", "Fully Autonomous"], ["human", "Human-Assisted"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAutonomyFilter(key)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              autonomyFilter === key
                ? "bg-[var(--navy-700)] text-white"
                : "text-[var(--gray-400)] hover:text-[var(--gray-600)] border border-[var(--gray-200)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Note */}
      <div className="mb-6 p-3 rounded-lg bg-[var(--gold-500)]/5 border border-[var(--gold-500)]/20 text-xs text-[var(--gray-500)]">
        Placeholder data shown below. Real results will populate as submissions
        are evaluated. Click column headers to sort.
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.12] text-[var(--gray-400)] text-xs uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">Rank</th>
              <th className="py-3 px-4 text-left font-medium">Team</th>
              <th className="py-3 px-4 text-left font-medium">System</th>
              <th className="py-3 px-4 text-center font-medium">Mode</th>
              <th
                className="py-3 px-4 text-right font-medium cursor-pointer hover:text-[var(--navy-700)] transition"
                onClick={() => setSortBy("score")}
              >
                Score {sortBy === "score" ? "v" : ""}
              </th>
              <th
                className="py-3 px-4 text-right font-medium cursor-pointer hover:text-[var(--navy-700)] transition"
                onClick={() => setSortBy("cas")}
              >
                CAS {sortBy === "cas" ? "v" : ""}
              </th>
              <th
                className="py-3 px-4 text-right font-medium cursor-pointer hover:text-[var(--navy-700)] transition"
                onClick={() => setSortBy("cost")}
              >
                Cost {sortBy === "cost" ? "v" : ""}
              </th>
              <th className="py-3 px-4 text-center font-medium">Integrity</th>
              <th
                className="py-3 px-4 text-right font-medium cursor-pointer hover:text-[var(--navy-700)] transition"
                onClick={() => setSortBy("dualScore")}
              >
                Dual Score {sortBy === "dualScore" ? "v" : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row) => (
              <tr
                key={row.team + row.system}
                className="leaderboard-row border-b border-[var(--gray-200)]"
              >
                <td
                  className="py-4 px-4 text-[var(--gray-400)]"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {row.rank}
                </td>
                <td className="py-4 px-4 font-semibold">{row.team}</td>
                <td className="py-4 px-4 text-[var(--gray-500)]">{row.system}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.autonomy === "auto"
                      ? "bg-[var(--emerald-500)]/10 text-[var(--emerald-500)]"
                      : "bg-[var(--violet-500)]/10 text-[var(--violet-500)]"
                  }`}>
                    {row.autonomy === "auto" ? "Auto" : "Human"}
                  </span>
                </td>
                <td
                  className="py-4 px-4 text-right"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {row.score.toFixed(1)}
                </td>
                <td
                  className={`py-4 px-4 text-right ${casColor(row.cas)}`}
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {row.cas.toFixed(2)}
                </td>
                <td
                  className="py-4 px-4 text-right text-[var(--gray-500)]"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {row.cost}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${integrityStyle(
                      row.integrity
                    )}`}
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  >
                    {row.integrity}
                  </span>
                </td>
                <td
                  className="py-4 px-4 text-right font-bold"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {row.dualScore.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card rounded-xl p-5 bg-white">
          <h3 className="font-semibold text-sm mb-3">Scoring Legend</h3>
          <div className="space-y-2 text-xs text-[var(--gray-500)]">
            <div>
              <strong className="text-[var(--navy-700)]">Score</strong> -- Raw task
              performance (higher is better)
            </div>
            <div>
              <strong className="text-[var(--navy-700)]">CAS</strong> -- Claim Accuracy
              Score: fraction of numerical claims verified against actual
              experiment outputs (0.0 to 1.0)
            </div>
            <div>
              <strong className="text-[var(--navy-700)]">Dual Score</strong> -- Score x
              CAS. Penalizes fabrication. This is the primary ranking metric.
            </div>
            <div>
              <strong className="text-[var(--navy-700)]">Cost</strong> -- Total API
              spend during evaluation run
            </div>
          </div>
        </div>
        <div className="card rounded-xl p-5 bg-white">
          <h3 className="font-semibold text-sm mb-3">Integrity Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[var(--emerald-500)]/10 text-[var(--emerald-500)]">
                PASS
              </span>
              <span className="text-[var(--gray-500)]">
                CAS &gt;= 0.8. All major claims verified.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[var(--gold-500)]/10 text-[var(--gold-500)]">
                FLAGGED
              </span>
              <span className="text-[var(--gray-500)]">
                CAS 0.5-0.8. Some claims unverifiable. Under review.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[var(--red-500)]/10 text-[var(--red-500)]">
                FAIL
              </span>
              <span className="text-[var(--gray-500)]">
                CAS &lt; 0.5. Significant fabrication detected. Disqualified
                from prize consideration.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
