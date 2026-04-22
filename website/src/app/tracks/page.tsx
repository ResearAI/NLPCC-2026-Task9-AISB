import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { NLPCC_PACKAGE_URL } from "@/lib/publicLinks";
import { getNlpccPaperGroups } from "@/lib/researchLibrary";

const TRACKS = [
  {
    id: "T1",
    name: "Agentic Coding & Research Engineering",
    nameCn: "智能体代码与科研工程",
    question:
      "Can an AI Scientist improve code-oriented research systems through real execution, debugging, ablation, and evidence-backed engineering iteration?",
    benchmark:
      "Public package includes runnable engineering tasks, benchmark docs, agent instructions, starter submissions, and local replay tools.",
    packageLink: `${NLPCC_PACKAGE_URL}/T1`,
  },
  {
    id: "T2",
    name: "Formal Mathematical Proof",
    nameCn: "形式化数学证明",
    question:
      "Can an AI Scientist run formal proof-search research that produces Lean-verified results rather than informal mathematical claims?",
    benchmark:
      "Public package centers on Lean4 theorem proving with executable verification, proof-trace requirements, and strict organizer-side rechecking.",
    packageLink: `${NLPCC_PACKAGE_URL}/T2`,
  },
  {
    id: "T3",
    name: "LifeSci/ADMET Scientific Discovery",
    nameCn: "生命科学/ADMET科学发现",
    question:
      "Can an AI Scientist run real scientific modeling loops on life-science data, improve predictive performance, and explain why a method works?",
    benchmark:
      "Public package currently focuses on ADMET-style public-dev scientific discovery tasks with runnable local evaluation and strict replayable submissions.",
    packageLink: `${NLPCC_PACKAGE_URL}/T3`,
  },
];

export default function TracksPage() {
  const paperGroups = getNlpccPaperGroups(6);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="NLPCC 2026 Tracks"
        titleCn="NLPCC 当前公开方向"
        subtitle="NLPCC is the current public AISB package. Each direction is introduced as a scientific problem first, then linked to its runnable benchmark package and paper library."
      />

      <section className="card-gold rounded-2xl p-6 bg-white mb-10">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--gray-400)", fontFamily: "'Source Code Pro', monospace" }}>
              For Humans
            </div>
            <p className="text-[var(--gray-500)]">
              Read the scientific problem, choose a direction, then hand the package to your AI Scientist.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--gray-400)", fontFamily: "'Source Code Pro', monospace" }}>
              For Agents
            </div>
            <p className="text-[var(--gray-500)]">
              Read `AGENT.md`, `bench.yaml`, `data/data.md`, and the paper library, then run local experiments and build a strict submission.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--gray-400)", fontFamily: "'Source Code Pro', monospace" }}>
              Leaderboard
            </div>
            <p className="text-[var(--gray-500)]">
              Track A = `1.0 * S_paper`. Track B = `0.7 * S_benchmark + 0.3 * S_paper`. Public rows are update-later until submission opening.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {TRACKS.map((track) => {
          const paperGroup = paperGroups.find((group) => group.id === track.id);
          return (
          <section key={track.id} id={track.id} className="card rounded-2xl p-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs border"
                style={{
                  fontFamily: "'Source Code Pro', monospace",
                  color: "var(--navy-700)",
                  borderColor: "var(--gray-200)",
                  background: "var(--gray-50)",
                }}
              >
                {track.id}
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)]">
                {track.name}
              </h2>
              <span className="text-sm text-[var(--gray-400)]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                / {track.nameCn}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl p-5 bg-gray-50 border border-[var(--gray-200)]">
                <div className="text-xs uppercase tracking-wider mb-2 text-[var(--gray-400)]">Scientific Question</div>
                <p className="text-sm text-[var(--gray-500)] leading-relaxed">{track.question}</p>
              </div>
              <div className="rounded-xl p-5 bg-gray-50 border border-[var(--gray-200)]">
                <div className="text-xs uppercase tracking-wider mb-2 text-[var(--gray-400)]">Benchmark Package</div>
                <p className="text-sm text-[var(--gray-500)] leading-relaxed mb-4">{track.benchmark}</p>
                <a
                  href={track.packageLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: "var(--gold-600)" }}
                >
                  Open benchmark package
                </a>
              </div>
              <div className="rounded-xl p-5 bg-gray-50 border border-[var(--gray-200)]">
                <div className="text-xs uppercase tracking-wider mb-2 text-[var(--gray-400)]">Reference Papers</div>
                <p className="text-sm text-[var(--gray-500)] leading-relaxed mb-4">
                  Representative papers are shown below. The full paper library and source JSON remain public.
                </p>
                <div className="space-y-2 mb-4">
                  {paperGroup?.papers.map((paper) => (
                    <a
                      key={paper.href}
                      href={paper.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm hover:underline"
                      style={{ color: "var(--navy-700)" }}
                    >
                      {paper.title}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={paperGroup?.jsonHref}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--gold-600)" }}
                  >
                    Open full paper JSON
                  </a>
                  <Link href="/papers" className="hover:underline" style={{ color: "var(--gold-600)" }}>
                    Browse paper library
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )})}
      </div>
    </div>
  );
}
