import SectionHeading from "@/components/SectionHeading";

const READY_CARDS = [
  {
    title: "Benchmark Leaderboard",
    subtitle: "基准榜单",
    detail:
      "Update later. Official benchmark rows will appear after public submission collection opens and organizer replay is enabled.",
  },
  {
    title: "Paper Leaderboard",
    subtitle: "论文榜单",
    detail:
      "Update later. Paper rows will be published after submission review, claim traceability checks, and organizer-side evaluation.",
  },
  {
    title: "Human-Assisted Board",
    subtitle: "人机协同榜单",
    detail:
      "Update later. Human-assisted runs will be reported separately from fully autonomous runs.",
  },
];

const FUTURE_FILTERS = [
  "competition",
  "leaderboard",
  "direction",
  "autonomy mode",
  "result type",
  "experiment setting",
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="AISB Leaderboard"
        titleCn="比赛榜单"
        subtitle="The leaderboard page is in ready state. Public rows will be updated later after organizer replay and submission opening."
      />

      <section className="card-gold rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-xl font-semibold mb-3">Current Status</h3>
        <p className="text-sm text-[var(--gray-500)] leading-relaxed">
          NLPCC 2026 is currently publishing benchmark packages, papers, tools, and local replay infrastructure.
          Public leaderboard rows are intentionally held in <strong>update later</strong> state until official submission
          collection opens.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        {READY_CARDS.map((card) => (
          <div key={card.title} className="card rounded-2xl p-6 bg-white">
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--gray-400)", fontFamily: "'Source Code Pro', monospace" }}
            >
              {card.subtitle}
            </div>
            <h3 className="text-xl font-semibold text-[var(--navy-700)] mb-3">{card.title}</h3>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                 style={{ background: "var(--gray-50)", color: "var(--gray-600)", border: "1px solid var(--gray-200)" }}>
              update later
            </div>
            <p className="text-sm text-[var(--gray-500)] leading-relaxed">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="card rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-lg font-semibold mb-3">What Will Appear Here Later</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {FUTURE_FILTERS.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "var(--gray-50)",
                color: "var(--gray-600)",
                border: "1px solid var(--gray-200)",
                fontFamily: "'Source Code Pro', monospace",
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-sm text-[var(--gray-500)] leading-relaxed">
          When live updates open, this page will support filtering by competition, direction, leaderboard type,
          autonomy mode, and experiment setting, similar to a modern benchmark hub rather than a static score table.
        </p>
      </section>

      <section className="card rounded-2xl p-6 bg-white">
        <h3 className="text-lg font-semibold mb-3">Leaderboard Policy</h3>
        <div className="space-y-3 text-sm text-[var(--gray-500)]">
          <p>Paper and benchmark leaderboards are separate. T1/T2/T3 are benchmark directions, not fixed weighted mixtures.</p>
          <p>Track A uses `Final_A = 1.0 * S_paper`. Track B uses `Final_B = 0.7 * S_benchmark + 0.3 * S_paper`.</p>
          <p>`CAS` is an integrity gate. Failed integrity checks lead to desk rejection rather than a lower weighted score.</p>
          <p>External papers and public SOTA references may be shown as context, but not as official NLPCC rows.</p>
          <p>Official rows will be published only after organizer-side replay and integrity checks.</p>
        </div>
      </section>
    </div>
  );
}
