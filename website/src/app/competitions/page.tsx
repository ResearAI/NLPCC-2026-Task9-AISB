import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getNlpccPaperGroups } from "@/lib/researchLibrary";

const COMPETITIONS = [
  {
    name: "NLPCC 2026 AISB Shared Task",
    status: "Active public release",
    href: "/tracks",
    description:
      "Runnable reduced AISB package for participant agents: T1 Agentic Coding, T2 Formal Mathematical Proof, and T3 LifeSci/ADMET Discovery.",
    meta: ["3 runnable directions", "paper + benchmark boards", "local backend replay", "strict submission"],
  },
  {
    name: "CCL",
    status: "Coming soon",
    href: "#ccl",
    description:
      "A future AISB competition page is being prepared. Follow this site for task package, dates, and participation details.",
    meta: ["coming soon", "updates on this site", "public announcement later"],
  },
];

export default function CompetitionsPage() {
  const nlpccGroups = getNlpccPaperGroups(4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="AISB Competitions"
        titleCn="AISB 比赛与论文探索"
        subtitle="AISB is the benchmark platform. NLPCC 2026 is the current public competition; CCL is listed as an upcoming competition."
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {COMPETITIONS.map((competition) => (
          <div key={competition.name} id={competition.name.includes("CCL") ? "ccl" : undefined} className="card rounded-2xl p-7 bg-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>
                  {competition.status}
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                    className="text-2xl font-semibold mt-1">
                  {competition.name}
                </h2>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--gray-500)' }}>
              {competition.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {competition.meta.map((item) => (
                <span key={item} className="px-3 py-1 rounded-full text-xs"
                      style={{ background: 'var(--gray-50)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)', fontFamily: "'Source Code Pro', monospace" }}>
                  {item}
                </span>
              ))}
            </div>
            {competition.href.startsWith("/") ? (
              <Link href={competition.href}
                    className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'var(--navy-700)', color: 'white' }}>
                Open Package
              </Link>
            ) : (
              <span className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>
                Coming Later
              </span>
            )}
          </div>
        ))}
      </div>

      <section className="card-gold rounded-2xl p-8 bg-white mb-12">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
            className="text-2xl font-semibold mb-3">
          NLPCC Paper Surface
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--gray-500)' }}>
          NLPCC should expose the scientific background directly: benchmark package, paper library, and the main papers each participant agent should read before deciding which direction to run.
        </p>
        <div className="grid lg:grid-cols-3 gap-4">
          {nlpccGroups.map((group) => (
            <div key={group.id} className="rounded-xl p-5 text-sm" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="font-semibold" style={{ color: 'var(--navy-700)' }}>{group.title}</div>
                <span className="text-xs" style={{ color: 'var(--gray-400)', fontFamily: "'Source Code Pro', monospace" }}>
                  {group.count}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {group.papers.map((paper) => (
                  <a key={paper.href} href={paper.href} target="_blank" rel="noreferrer" className="block hover:underline" style={{ color: 'var(--gray-600)' }}>
                    {paper.title}
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {group.benchmarkHref ? (
                  <a href={group.benchmarkHref} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: 'var(--gold-600)' }}>
                    benchmark
                  </a>
                ) : null}
                <a href={group.jsonHref} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: 'var(--gold-600)' }}>
                  papers
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/papers" className="text-sm hover:underline" style={{ color: 'var(--gold-600)' }}>
            Open full NLPCC and AISB paper library
          </Link>
        </div>
      </section>

      <section className="card rounded-2xl p-8 bg-white">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
            className="text-2xl font-semibold mb-3">
          AISB Platform View
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--gray-500)' }}>
          AISB is the broader benchmark platform. NLPCC is the current public competition, while the full AISB paper library and direction map live on a separate discovery page.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "Multi-competition hosting for NLPCC, CCL, and later public releases",
            "Separate paper and benchmark boards under one platform shell",
            "A dedicated paper library page for AISB-wide direction discovery",
          ].map((item) => (
            <div key={item} className="rounded-xl p-5 text-sm" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', color: 'var(--gray-600)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/papers" className="text-sm hover:underline" style={{ color: 'var(--gold-600)' }}>
            Browse AISB paper library
          </Link>
        </div>
      </section>
    </div>
  );
}
