import SectionHeading from "@/components/SectionHeading";
import { getAisbPaperGroups, getNlpccPaperGroups } from "@/lib/researchLibrary";

export default function PapersPage() {
  const nlpccGroups = getNlpccPaperGroups(10);
  const aisbGroups = getAisbPaperGroups(5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="Paper Library"
        titleCn="论文库"
        subtitle="This page exposes the public paper libraries used by NLPCC and AISB. Each direction links to the source JSON and to direct paper URLs."
      />

      <section className="card-gold rounded-2xl p-8 bg-white mb-10">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)] mb-3">
          NLPCC 2026 Directions
        </h2>
        <p className="text-sm text-[var(--gray-500)] mb-6">
          NLPCC is the current public AISB release. These three directions are the paper libraries participant agents should read first.
        </p>
        <div className="grid lg:grid-cols-3 gap-6">
          {nlpccGroups.map((group) => (
            <section key={group.id} className="rounded-2xl p-6 bg-[var(--gray-50)] border border-[var(--gray-200)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, var(--gold-400), rgba(212,168,83,0.15))" }} />
              <div className="flex items-center justify-between gap-3 mb-4 pt-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[var(--gray-400)]">{group.id}</div>
                  <h3 className="text-lg text-[var(--navy-700)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {group.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs border border-[var(--gray-200)] bg-white text-[var(--gray-500)]">
                  {group.count} papers
                </span>
              </div>
              <div className="space-y-3 mb-5">
                {group.papers.map((paper, index) => (
                  <a
                    key={paper.href}
                    href={paper.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl p-3 hover:underline"
                    style={{ background: "white", border: "1px solid var(--gray-200)", color: "var(--navy-700)" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-xs mt-0.5" style={{ color: "var(--gold-600)", fontFamily: "'Source Code Pro', monospace" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm leading-relaxed">{paper.title}</div>
                        {(paper.venue || paper.type) ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {paper.venue ? (
                              <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: "var(--gray-50)", color: "var(--gray-500)", border: "1px solid var(--gray-200)" }}>
                                {paper.venue}
                              </span>
                            ) : null}
                            {paper.type ? (
                              <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: "rgba(212,168,83,0.1)", color: "var(--gold-600)", border: "1px solid rgba(212,168,83,0.2)" }}>
                                {paper.type}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {group.benchmarkHref ? (
                  <a href={group.benchmarkHref} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--gold-600)" }}>
                    Open benchmark package
                  </a>
                ) : null}
                <a href={group.jsonHref} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--gold-600)" }}>
                  Open source JSON
                </a>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="card rounded-2xl p-8 bg-white">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)] mb-3">
          AISB Research Directions
        </h2>
        <p className="text-sm text-[var(--gray-500)] mb-6">
          AISB is broader than NLPCC. The full platform paper library spans all published or planned research directions.
        </p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {aisbGroups.map((group) => (
            <section key={group.id} className="rounded-2xl p-6 bg-[var(--gray-50)] border border-[var(--gray-200)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, var(--navy-700), rgba(26,54,93,0.12))" }} />
              <div className="flex items-center justify-between gap-3 mb-4 pt-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[var(--gray-400)]">AISB Direction</div>
                  <h3 className="text-lg text-[var(--navy-700)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {group.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs border border-[var(--gray-200)] bg-white text-[var(--gray-500)]">
                  {group.count}
                </span>
              </div>
              <div className="space-y-3 mb-5">
                {group.papers.map((paper) => (
                  <a
                    key={paper.href}
                    href={paper.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl p-3 hover:underline"
                    style={{ background: "white", border: "1px solid var(--gray-200)", color: "var(--navy-700)" }}
                  >
                    <div className="text-sm leading-relaxed">{paper.title}</div>
                    {(paper.venue || paper.type) ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {paper.venue ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: "var(--gray-50)", color: "var(--gray-500)", border: "1px solid var(--gray-200)" }}>
                            {paper.venue}
                          </span>
                        ) : null}
                        {paper.type ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: "rgba(26,54,93,0.06)", color: "var(--navy-700)", border: "1px solid rgba(26,54,93,0.12)" }}>
                            {paper.type}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </a>
                ))}
              </div>
              <a href={group.jsonHref} target="_blank" rel="noreferrer" className="text-sm hover:underline" style={{ color: "var(--gold-600)" }}>
                Open source JSON
              </a>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
