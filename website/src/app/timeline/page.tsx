import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

const TIMELINE_EVENTS = [
  {
    date: "June 2026",
    title: "Competition Announcement + Registration",
    description:
      "Competition officially announced. Teams register on Codabench. Reference papers and task descriptions released.",
    status: "active" as const,
  },
  {
    date: "July 2026",
    title: "Task Packages Released",
    description:
      "Full task packages with benchmark data subsets, baseline code, and 24 reference papers (8 per direction). Development phase begins.",
    status: "upcoming" as const,
  },
  {
    date: "August 2026",
    title: "Development Phase + Leaderboard",
    description:
      "Public development leaderboard opens on Codabench. Teams develop and test AI Scientist systems. Best@3 submissions tracked.",
    status: "upcoming" as const,
  },
  {
    date: "September 2026",
    title: "Evaluation Phase",
    description:
      "Held-out test data released (same distribution, different problems). Final evaluation round with integrity checking.",
    status: "upcoming" as const,
  },
  {
    date: "October 1, 2026",
    title: "Submission Deadline",
    description:
      "Final submissions due (Best@3). Submit via Codabench: paper PDF + scores.json + code repo URL + experiment logs.",
    status: "upcoming" as const,
  },
  {
    date: "October 15, 2026",
    title: "Results Published",
    description:
      "Final leaderboard published. Track A and Track B winners announced separately for autonomous and human-assisted categories.",
    status: "upcoming" as const,
  },
  {
    date: "July 15, 2026",
    title: "System Description Papers Due",
    description:
      "Participating teams submit a 4-page system description paper. Papers describe the approach, design decisions, and lessons learned. Required for prize eligibility.",
    status: "upcoming" as const,
  },
  {
    date: "August 2026",
    title: "NLPCC 2026 Workshop",
    description:
      "AISB shared task workshop at NLPCC 2026. Presentations by top-ranking teams, panel discussion on AI scientist integrity, and release of the full evaluation dataset.",
    status: "upcoming" as const,
  },
];

function statusColor(status: string) {
  switch (status) {
    case "completed":
      return "var(--emerald-500)";
    case "active":
      return "var(--gold-500)";
    case "upcoming":
      return "var(--gray-400)";
    default:
      return "var(--gray-400)";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "completed":
      return "COMPLETED";
    case "active":
      return "CURRENT";
    case "upcoming":
      return "UPCOMING";
    default:
      return "";
  }
}

export default function TimelinePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="Timeline"
        subtitle="Key dates for AISB 2026, from registration through the NLPCC 2026 workshop."
      />

      <div className="flex justify-center mb-12">
        <Image src="/timeline-visual.png" alt="AISB 2026 Competition Timeline"
               width={2000} height={500} className="rounded-xl"
               style={{ maxWidth: '900px', width: '100%', height: 'auto' }} />
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, index) => {
            const color = statusColor(event.status);
            return (
              <div key={index} className="relative flex gap-6 md:gap-8">
                {/* Dot */}
                <div className="relative z-10 shrink-0 mt-1">
                  <div
                    className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full border-2"
                    style={{
                      borderColor: color,
                      background:
                        event.status === "active" ? color : "transparent",
                      boxShadow:
                        event.status === "active"
                          ? `0 0 12px ${color}50`
                          : "none",
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  className={`card rounded-xl p-5 bg-white flex-1 ${
                    event.status === "active"
                      ? "border-[var(--gold-500)]/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'Source Code Pro', monospace",
                        color: color,
                      }}
                    >
                      {event.date}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
                      style={{
                        fontFamily: "'Source Code Pro', monospace",
                        color: color,
                        background: `${color}15`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {statusLabel(event.status)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--gray-500)] leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-16 card rounded-xl p-6 bg-white">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-4"
        >
          Important Notes
        </h3>
        <div className="space-y-3 text-sm text-[var(--gray-500)]">
          <div className="flex items-start gap-2">
            <span
              className="text-[var(--gold-500)] mt-0.5 shrink-0"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              *
            </span>
            <span>
              All deadlines are at 23:59 UTC on the stated date unless otherwise
              specified.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="text-[var(--gold-500)] mt-0.5 shrink-0"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              *
            </span>
            <span>
              Validation server submissions do not count toward the final
              evaluation. They are for format checking and debugging only.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="text-[var(--gold-500)] mt-0.5 shrink-0"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              *
            </span>
            <span>
              Teams must register before submitting. Registration is free and
              open to all. No affiliation requirements.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="text-[var(--gold-500)] mt-0.5 shrink-0"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              *
            </span>
            <span>
              Dates may shift slightly. Check this page and the GitHub
              repository for the latest schedule.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
