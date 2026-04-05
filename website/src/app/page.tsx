import Link from "next/link";
import Image from "next/image";

const STATS = [
  { value: "3", label: "Research Directions", sub: "研究方向" },
  { value: "2", label: "Competition Tracks", sub: "竞赛赛道" },
  { value: "24", label: "Reference Papers", sub: "参考论文" },
  { value: "ICLR", label: "Paper Format", sub: "论文格式" },
];

const WORKFLOW = [
  { step: "01", label: "Literature", cn: "文献阅读" },
  { step: "02", label: "Hypothesis", cn: "假设提出" },
  { step: "03", label: "Experiment", cn: "实验设计" },
  { step: "04", label: "Execution", cn: "代码执行" },
  { step: "05", label: "Analysis", cn: "结果分析" },
  { step: "06", label: "Paper", cn: "论文产出" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — navy banner matching poster top strip */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--navy-700) 50%, var(--navy-600) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-5"
                    style={{ background: 'rgba(212,168,83,0.2)', color: 'var(--gold-300)', border: '1px solid rgba(212,168,83,0.3)', fontFamily: "'Source Code Pro', monospace" }}>
                NLPCC 2026 SHARED TASK
              </span>

              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white' }}
                  className="text-5xl md:text-6xl leading-[1.05] mb-2 font-bold">
                AISB
              </h1>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-3xl md:text-4xl leading-[1.15] mb-6">
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>AI Scientist </span>
                <span style={{ color: 'var(--gold-400)' }}>Benchmark</span>
              </h2>

              <p className="text-lg leading-relaxed mb-2 max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Evaluating <strong style={{ color: 'var(--gold-300)' }}>autonomous AI research capability</strong> —
                discover problems, think, explore, validate through experiments, and communicate findings.
              </p>
              <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Noto Sans SC', sans-serif" }}>
                评测AI自主科研能力 — 发现问题、思考探索、假设-实验验证、将结论讲出来让人理解
              </p>

              <div className="flex gap-3 flex-wrap">
                <Link href="/cfp"
                      className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:brightness-110"
                      style={{ background: 'var(--gold-500)', color: 'var(--navy-900)' }}>
                  Call for Participation
                </Link>
                <Link href="/leaderboard"
                      className="px-6 py-3 rounded-xl font-medium text-sm transition border"
                      style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}>
                  Leaderboard
                </Link>
                <Link href="/tracks"
                      className="px-6 py-3 rounded-xl font-medium text-sm transition border"
                      style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}>
                  Explore Tracks
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl"
                   style={{ border: '2px solid rgba(212,168,83,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                <Image src="/poster.png" alt="AISB 2026 Poster" width={800} height={450}
                       className="w-full h-auto" priority />
              </div>
            </div>
          </div>
        </div>
        {/* Subtle glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[120px]"
             style={{ background: 'var(--gold-500)' }} />
      </section>

      {/* Stats — white section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div style={{ fontFamily: "'Source Code Pro', monospace", color: 'var(--navy-700)' }}
                   className="text-3xl font-semibold">
                {s.value}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--gray-600)' }}>{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Workflow */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }} className="text-3xl font-semibold mb-2">
            Autonomous AI Research Pipeline
          </h2>
          <p style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
            AI 自主科研全流程
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {WORKFLOW.map((w, i) => (
            <div key={w.step} className="flex items-center gap-3">
              <div className="card-gold px-5 py-4 text-center min-w-[100px]">
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>{w.step}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--navy-700)' }}>{w.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>{w.cn}</div>
              </div>
              {i < WORKFLOW.length - 1 && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" style={{ color: 'var(--gold-500)', opacity: 0.5 }}>
                  <path d="M6 10h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fabrication Callout */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'var(--red-50)', border: '1px solid rgba(229,62,62,0.15)' }}>
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(26,54,93,0.08)', color: 'var(--navy-700)', border: '1px solid rgba(26,54,93,0.15)', fontFamily: "'Source Code Pro', monospace" }}>
            WHY THIS MATTERS
          </span>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-800)' }}
              className="text-2xl md:text-3xl mt-4 mb-4 font-semibold">
            The full research cycle:{" "}
            <span style={{ color: 'var(--gold-600)' }}>Idea + Experiment + Report</span>
          </h3>
          <p style={{ color: 'var(--gray-600)' }} className="leading-relaxed max-w-3xl">
            Can an AI discover a meaningful scientific problem? Form a hypothesis and reason about
            why an approach should work? Design experiments that validate — not just optimize?
            Then communicate findings in a way humans can understand and reproduce?
          </p>
          <p className="leading-relaxed max-w-3xl mt-3 text-sm" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
            发现科学问题 → 思考探索 → 假设-实验验证 → 将结论讲出来，让人理解。73%的AI论文伪造结果，AISB通过CAS验证每个声明的真实性。
          </p>
          <Link href="/integrity"
                className="inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition"
                style={{ background: 'rgba(26,54,93,0.08)', color: 'var(--navy-700)', border: '1px solid rgba(26,54,93,0.15)' }}>
            How we verify integrity
          </Link>
        </div>
      </section>

      {/* Two Tracks */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }} className="text-3xl font-semibold mb-2">
          Competition Tracks
        </h2>
        <p className="mb-8" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
          两大赛道，全面评估 AI 科研能力
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/tracks#trackA" className="card p-8 group">
            <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', border: '1px solid var(--gold-300)', fontFamily: "'Source Code Pro', monospace" }}>
              TRACK 1
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                className="text-2xl mt-3 mb-1 font-semibold group-hover:text-[var(--gold-600)] transition">
              Scientific Research
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--gold-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              科学研究赛道
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>
              Discover scientific problems from literature, form hypotheses, validate through experiments,
              and write a paper that communicates the findings clearly. Experiments support the idea — the idea is the core.
            </p>
          </Link>

          <Link href="/tracks#trackB" className="card p-8 group">
            <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--violet-50)', color: 'var(--violet-600)', border: '1px solid rgba(107,70,193,0.2)', fontFamily: "'Source Code Pro', monospace" }}>
              TRACK 2
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                className="text-2xl mt-3 mb-1 font-semibold group-hover:text-[var(--violet-600)] transition">
              Benchmark SOTA Challenge
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--violet-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              基准提升赛道
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>
              Propose scientifically grounded methods to improve SOTA. Experiments are the primary evidence,
              but you must explain <strong>why your method works</strong> — interpretable improvement over blind optimization.
            </p>
          </Link>
        </div>
      </section>

      {/* Key Dates — gold banner */}
      <section className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }} className="text-xl font-semibold mb-6">
            Key Dates / 重要日期
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { date: "Jun", cn: "6月", event: "Announcement", eventCn: "竞赛公告" },
              { date: "Jul", cn: "7月", event: "Task Packages", eventCn: "任务发布" },
              { date: "Oct 1", cn: "10月1日", event: "Deadline", eventCn: "提交截止" },
              { date: "Nov", cn: "11月", event: "NLPCC Macau", eventCn: "澳门发布" },
            ].map((d) => (
              <div key={d.date} className="pl-4" style={{ borderLeft: '3px solid var(--gold-400)' }}>
                <div style={{ fontFamily: "'Source Code Pro', monospace", color: 'var(--navy-700)' }}
                     className="text-lg font-semibold">{d.date}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--gray-600)' }}>{d.event}</div>
                <div className="text-xs" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>
                  {d.cn} &middot; {d.eventCn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
