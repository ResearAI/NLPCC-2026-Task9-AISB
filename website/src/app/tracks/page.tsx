import SectionHeading from "@/components/SectionHeading";

const TRACKS = [
  {
    id: "T1",
    name: "AI/CS Reasoning & Engineering",
    color: "var(--gold-500)",
    description:
      "Can AI systems produce verifiable improvements in expert-level cross-disciplinary reasoning and real software engineering? 8 reference papers provided including 3 provocative findings on reasoning limitations.",
    benchmarks: [
      {
        name: "HLE-Verified (50 questions)",
        detail: "Humanity's Last Exam — Verified. 50 questions stratified across math/physics, CS/logic, bio/chem, social science, and cross-disciplinary. SOTA: Gemini 3.1 Pro ~45%.",
        metrics: "Exact-match accuracy + o3-mini judge for short answers",
      },
      {
        name: "FeatureBench (20 tasks)",
        detail: "Agentic coding for complex feature development. 20 tasks from 13 Docker images across 24 Python repos. SOTA: GPT-5.1-Codex 12.5%.",
        metrics: "Docker containerized pytest pass/fail",
      },
    ],
    baseline: "SOTA: HLE ~45%, FeatureBench 12.5%",
    scoring: "Paper quality + benchmark performance + reproducibility (CAS)",
    budget: "No fixed resource limit. Report cost in paper.",
    dataLink: "https://github.com/ResearAI/NLPCC-2026-Task9-AISB",
  },
  {
    id: "T2",
    name: "Math and Proof",
    color: "var(--violet-500)",
    description:
      "Test formal mathematical reasoning and proof generation. Systems must produce machine-verifiable proofs in Lean4, not just natural language solutions. This track has zero tolerance for fabrication -- proofs either verify or they do not.",
    benchmarks: [
      {
        name: "FormalMATH",
        detail: "50 problems from undergraduate to research-level mathematics. Each problem requires a complete formal proof in Lean4 that type-checks successfully.",
        metrics: "Proof completion rate (%), proof length efficiency",
      },
    ],
    baseline: "Baseline DeepSeek-Prover-V2: 28% completion rate",
    scoring: "Paper quality + proof completion rate + reproducibility (CAS)",
    budget: "No fixed resource limit. Report cost in paper.",
    dataLink: "https://github.com/ResearAI/NLPCC-2026-Task9-AISB",
  },
  {
    id: "T3",
    name: "Scientific Discovery",
    color: "var(--emerald-500)",
    description:
      "Evaluate AI systems on real scientific prediction tasks. This track requires systems to make quantitative predictions on held-out data, combining domain knowledge with computational methods. No room for fabrication -- predictions are scored against ground truth.",
    benchmarks: [
      {
        name: "TDC ADMET",
        detail: "5 ADMET endpoints (Caco-2 permeability, hERG inhibition, Microsomal clearance, Lipophilicity, Solubility). Systems predict molecular properties from SMILES strings.",
        metrics: "Average MAE across 5 endpoints, normalized against baseline",
      },
      {
        name: "Matbench Discovery",
        detail: "Materials property prediction. Systems predict formation energy and stability of inorganic crystals from structure data.",
        metrics: "F1 score for stable/unstable classification, MAE for energy",
      },
    ],
    baseline: "Baseline RF/XGBoost: TDC avg MAE 0.82, Matbench F1 0.58",
    scoring: "Paper quality + benchmark performance + reproducibility (CAS)",
    budget: "No fixed resource limit. Report cost in paper.",
    dataLink: "https://github.com/ResearAI/NLPCC-2026-Task9-AISB",
  },
];

export default function TracksPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="Competition Tracks"
        subtitle="Three tracks evaluating different facets of AI scientific capability. All tracks include mandatory integrity verification."
      />

      {/* Track Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-16">
        {TRACKS.map((track) => (
          <a
            key={track.id}
            href={`#${track.id}`}
            className="card rounded-xl p-5 bg-white hover:bg-gray-50 transition-all"
          >
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "'Source Code Pro', monospace",
                color: track.color,
              }}
            >
              {track.id}
            </span>
            <h3 className="font-semibold text-lg mt-1">{track.name}</h3>
            <p className="text-xs text-[var(--gray-400)] mt-2">
              {track.benchmarks.map((b) => b.name).join(" + ")}
            </p>
          </a>
        ))}
      </div>

      {/* Track Details */}
      <div className="space-y-16">
        {TRACKS.map((track) => (
          <section key={track.id} id={track.id} className="scroll-mt-24">
            <div className="card rounded-2xl p-8 bg-white relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.05] blur-[80px]"
                style={{ background: track.color }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs border"
                    style={{
                      fontFamily: "'Source Code Pro', monospace",
                      color: track.color,
                      borderColor: `${track.color}33`,
                      background: `${track.color}15`,
                    }}
                  >
                    {track.id}
                  </span>
                  <h3
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-2xl"
                  >
                    {track.name}
                  </h3>
                </div>
                <p className="text-[var(--gray-500)] leading-relaxed mb-8 max-w-3xl">
                  {track.description}
                </p>

                {/* Benchmarks */}
                <h4 className="text-xs text-[var(--gray-400)] uppercase tracking-wider font-medium mb-4">
                  Benchmarks
                </h4>
                <div className="space-y-4 mb-8">
                  {track.benchmarks.map((bench) => (
                    <div
                      key={bench.name}
                      className="rounded-xl p-5 bg-gray-50 border border-[var(--gray-200)]"
                    >
                      <h5 className="font-semibold text-sm mb-2">
                        {bench.name}
                      </h5>
                      <p className="text-sm text-[var(--gray-500)] mb-2">
                        {bench.detail}
                      </p>
                      <div
                        className="text-xs text-[var(--gray-400)]"
                        style={{
                          fontFamily: "'Source Code Pro', monospace",
                        }}
                      >
                        Metrics: {bench.metrics}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
                    <div className="text-xs text-[var(--gray-400)] uppercase tracking-wider mb-2">
                      Scoring Formula
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        fontFamily: "'Source Code Pro', monospace",
                      }}
                    >
                      {track.scoring}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
                    <div className="text-xs text-[var(--gray-400)] uppercase tracking-wider mb-2">
                      Baseline
                    </div>
                    <div
                      className="text-sm text-[var(--gray-500)]"
                      style={{
                        fontFamily: "'Source Code Pro', monospace",
                      }}
                    >
                      {track.baseline}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
                    <div className="text-xs text-[var(--gray-400)] uppercase tracking-wider mb-2">
                      Resource Budget
                    </div>
                    <div
                      className="text-sm text-[var(--gray-500)]"
                      style={{
                        fontFamily: "'Source Code Pro', monospace",
                      }}
                    >
                      {track.budget}
                    </div>
                  </div>
                </div>

                {/* Data Link */}
                <div className="mt-6">
                  <a
                    href={track.dataLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm hover:underline transition"
                    style={{ color: track.color }}
                  >
                    View sample data and starter code on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Common Rules */}
      <div className="mt-16 card rounded-xl p-6 bg-white">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-4"
        >
          Common to All Tracks
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-[var(--gray-500)]">
          <div>
            <h4 className="font-medium text-[var(--navy-700)] mb-2">
              Integrity Verification
            </h4>
            <p>
              All submissions pass through the 4-layer integrity system. Docker
              sandboxing ensures reproducibility. CAS (Claim Accuracy Score)
              must be above 0.5 to qualify for ranking.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[var(--navy-700)] mb-2">Dual Score</h4>
            <p>
              Final ranking uses DualScore = RawScore x CAS. A system that
              scores 90% on the task but has CAS of 0.3 gets a DualScore of
              27, ranked below a system that scores 60% with CAS of 0.9
              (DualScore 54).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
