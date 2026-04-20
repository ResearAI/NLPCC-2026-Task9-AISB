import Link from "next/link";
import Image from "next/image";
import { NLPCC_PACKAGE_URL, PUBLIC_REPO_URL } from "@/lib/publicLinks";

const STATS = [
  { value: "12", label: "Research Directions", sub: "研究方向" },
  { value: "117", label: "Benchmarks", sub: "AISB 总基准" },
  { value: "8", label: "AI Scientist Systems", sub: "AI 科学家系统" },
];

const CURRENT_COMPETITION = {
  title: "NLPCC 2026 AISB Shared Task",
  status: "Current public competition",
  summary:
    "A reduced, runnable AISB release for testing AI Scientist agents on T1 agentic coding, T2 formal proof, and T3 LifeSci/ADMET discovery.",
  details: ["3 runnable directions", "paper + benchmark boards", "local self-service replay"],
};

// Research cycle and dual-track visuals are now image-based (see /public/)

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
                AI SCIENTIST BENCHMARK PLATFORM
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
                Evaluating <strong style={{ color: 'var(--gold-300)' }}>complete AI research capability</strong>:
                discover problems, form hypotheses, run real experiments, and write traceable research papers.
              </p>
              <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Noto Sans SC', sans-serif" }}>
                AISB 是面向多场比赛和多方向 benchmark 的平台；NLPCC 2026 是当前置顶公开赛，公开方向统一为 Agentic Coding、Formal Math、LifeSci/ADMET。
              </p>

              <div className="flex gap-3 flex-wrap">
                <a href="https://forms.gle/9oWtS77UduudpRM1A" target="_blank" rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:brightness-110"
                      style={{ background: 'var(--gold-500)', color: 'var(--navy-900)' }}>
                  Register Now
                </a>
                <Link href="/cfp"
                      className="px-6 py-3 rounded-xl font-medium text-sm transition border"
                      style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}>
                  Call for Participation
                </Link>
                <Link href="/competitions"
                      className="px-6 py-3 rounded-xl font-medium text-sm transition border"
                      style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}>
                  Explore Competitions
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Current Competition */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="card-gold rounded-2xl p-8 bg-white">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>
                PINNED COMPETITION
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                  className="text-3xl font-semibold mb-3">
                {CURRENT_COMPETITION.title}
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
                {CURRENT_COMPETITION.summary}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {CURRENT_COMPETITION.details.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full text-xs"
                        style={{ background: 'var(--gray-50)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)', fontFamily: "'Source Code Pro', monospace" }}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/tracks"
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                      style={{ background: 'var(--navy-700)', color: 'white' }}>
                  NLPCC Tracks
                </Link>
                <Link href="/cfp"
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold border"
                      style={{ borderColor: 'var(--gold-300)', color: 'var(--gold-600)' }}>
                  CFP
                </Link>
                <Link href="/leaderboard"
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold border"
                      style={{ borderColor: 'var(--gray-200)', color: 'var(--navy-700)' }}>
                  Leaderboard
                </Link>
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
              <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--gray-400)', fontFamily: "'Source Code Pro', monospace" }}>
                Agent Entry
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--navy-700)', fontFamily: "'Playfair Display', Georgia, serif" }}>
                Give the agent a repository and an instruction
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--gray-500)' }}>
                AI Scientist can do this, but the input should be an executable instruction, not a vague prompt. The current public release is the NLPCC package, so the agent should start from that package, inspect T1, T2, and T3, recommend a direction, and run the chosen benchmark end to end.
              </p>
              <div className="grid gap-3">
                <div className="rounded-lg p-3" style={{ background: 'white', border: '1px solid var(--gray-200)' }}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--gray-400)', fontFamily: "'Source Code Pro', monospace" }}>
                    NLPCC Agent Instruction
                  </div>
                  <pre className="text-xs leading-relaxed overflow-x-auto rounded-lg p-3 mt-2" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', color: 'var(--gray-600)', fontFamily: "'Source Code Pro', monospace" }}>
{`Use current NLPCC public package: ${NLPCC_PACKAGE_URL}
Inspect T1,T2,T3 under benchmarks/nlpcc, read the benchmark package and papers for each direction,
tell me which direction best fits my goal and why, then run the chosen benchmark end to end
and prepare a strict submission with validate/package/replay ready.`}
                  </pre>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <a href={NLPCC_PACKAGE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-semibold border"
                        style={{ borderColor: 'var(--gray-200)', color: 'var(--navy-700)' }}>
                    Open NLPCC Package
                  </a>
                  <a href={PUBLIC_REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-semibold border"
                        style={{ borderColor: 'var(--gray-200)', color: 'var(--navy-700)' }}>
                    Open Public Repo
                  </a>
                  <Link href="/rules"
                        className="px-4 py-2 rounded-lg text-sm font-semibold"
                        style={{ background: 'var(--navy-700)', color: 'white' }}>
                    Copy Agent Instruction
                  </Link>
                  <Link href="/papers"
                        className="px-4 py-2 rounded-lg text-sm font-semibold border"
                        style={{ borderColor: 'var(--gold-300)', color: 'var(--gold-600)' }}>
                    Open Paper Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Tracks Visual */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-center">
          <Image src="/dual-track.jpeg" alt="Paper Track and Benchmark Track"
                 width={1600} height={800} className="rounded-xl"
                 style={{ maxWidth: '800px', width: '100%', height: 'auto' }} />
        </div>
        <p className="text-center mt-4 text-sm" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
          Paper Track 和 Benchmark Track 分开排名；T1/T2/T3 是 benchmark 方向，不是固定加权混合分。
        </p>
        <div className="text-center mt-4">
          <Link href="/integrity"
                className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition"
                style={{ background: 'rgba(26,54,93,0.08)', color: 'var(--navy-700)', border: '1px solid rgba(26,54,93,0.15)' }}>
            How we verify integrity
          </Link>
        </div>
      </section>

      {/* Two Tracks */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }} className="text-3xl font-semibold mb-2">
          AISB Leaderboard Tracks
        </h2>
        <p className="mb-8" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
          AISB 支持完全自动化和人机协同两类参与方式；NLPCC 当前公开 3 个可本地 replay 的方向。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/leaderboard" className="card p-8 group">
            <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', border: '1px solid var(--gold-300)', fontFamily: "'Source Code Pro', monospace" }}>
              PAPER
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                className="text-2xl mt-3 mb-1 font-semibold group-hover:text-[var(--gold-600)] transition">
              Paper Track
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--gold-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              论文赛道
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>
              Evaluate research papers produced by AI Scientist systems. Ranking is based on paper quality,
              traceable claims, research insight, and integrity verification.
            </p>
          </Link>

          <Link href="/leaderboard" className="card p-8 group">
            <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--violet-50)', color: 'var(--violet-600)', border: '1px solid rgba(107,70,193,0.2)', fontFamily: "'Source Code Pro', monospace" }}>
              BENCHMARK
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-700)' }}
                className="text-2xl mt-3 mb-1 font-semibold group-hover:text-[var(--violet-600)] transition">
              Benchmark Track
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--violet-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              基准赛道
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>
              Evaluate executable benchmark performance on T1/T2/T3. Ranking is based on verified task scores,
              reproducibility, experiment settings, and integrity verification.
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
              { date: "Apr 15", cn: "4月15日", event: "Public Release", eventCn: "公开发布" },
              { date: "May 25", cn: "5月25日", event: "Registration", eventCn: "报名截止" },
              { date: "Jun 1", cn: "6月1日", event: "Live Update", eventCn: "排行榜更新" },
              { date: "Aug 1", cn: "8月1日", event: "Deadline", eventCn: "提交截止" },
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
