import Image from "next/image";
import Link from "next/link";
import { NLPCC_PACKAGE_URL, PUBLIC_REPO_URL } from "@/lib/publicLinks";
const AI_SCIENTIST_PROMPT = `Use current NLPCC public package: ${NLPCC_PACKAGE_URL}. Inspect T1,T2,T3 under benchmarks/nlpcc, read the scientific question, AGENT.md, bench.yaml, data/data.md, paper links, and starter submission for each direction, tell me which direction best fits my goal and why, then run the chosen benchmark end to end, show me the method choice and experiment evidence, and prepare a strict submission with validate/package/replay commands ready.`;

export default function CfpPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6"
              style={{ background: 'rgba(212,168,83,0.12)', color: 'var(--gold-600)', border: '1px solid rgba(212,168,83,0.25)', fontFamily: "'Source Code Pro', monospace" }}>
          CALL FOR PARTICIPATION
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-4xl md:text-5xl font-bold mb-4">
          AISB 2026: AI Scientist Benchmark
        </h1>
        <p className="text-xl" style={{ color: 'var(--gray-600)' }}>
          Current Competition: NLPCC 2026 Shared Task
        </p>
        <p className="text-lg mt-2" style={{ color: 'var(--gold-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
          评测AI自主科研能力：发现问题 + 实验验证 + 成果表达
        </p>
      </div>

      {/* Poster */}
      <div className="rounded-2xl overflow-hidden border mb-16 shadow-2xl"
           style={{ borderColor: 'rgba(212,168,83,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <Image src="/poster.png" alt="AISB 2026 Official Poster" width={1600} height={900}
               className="w-full h-auto" priority />
      </div>

      {/* Bilingual Content */}
      <div className="space-y-12">

        {/* Overview */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-6">
            Overview / 概述
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div style={{ color: 'var(--gray-600)' }}>
              <p className="mb-4">
                <strong>AISB (AI Scientist Benchmark)</strong> is a platform for evaluating AI systems as researchers —
                the complete cycle of <strong style={{ color: 'var(--gold-600)' }}>Idea + Experiment + Report</strong>.
                Given a research topic and reference papers, AI systems must discover scientific problems,
                form hypotheses, validate through experiments, and communicate findings in a paper humans can understand.
              </p>
              <p className="mb-4">
                The current NLPCC 2026 public release is one AISB-hosted competition and exposes three runnable directions:
                T1 Agentic Coding & Research Engineering, T2 Formal Mathematical Proof, and T3 LifeSci/ADMET Scientific Discovery.
                Integrity verification (CAS) ensures all claimed results are real, not fabricated.
              </p>
              <p>
                The current public package is a local self-service release: benchmark materials,
                evaluation tools, submission validation, and local backend replay are included in the repository.
              </p>
            </div>
            <div style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              <p className="mb-4">
                <strong>AISB（AI科学家基准测试）</strong>是评测 AI 科研能力的平台——
                完整的<strong style={{ color: 'var(--gold-600)' }}>Idea + Experiment + Report</strong>循环。
                给定研究主题和参考论文，AI系统须发现科学问题、形成假设、通过实验验证、并将结论写成人类可理解的论文。
              </p>
              <p className="mb-4">
                当前 NLPCC 2026 公开版本是 AISB 目前置顶的一场比赛，提供 3 个可运行方向：
                T1 智能体代码与科研工程、T2 形式化数学证明、T3 生命科学/ADMET 科学发现。
                CAS（声明准确度分数）确保所有声称的结果真实可追溯。
              </p>
              <p>
                当前公开包是本地自助版本：benchmark 材料、评测工具、submission 校验和本地 backend replay 都在仓库中提供。
              </p>
            </div>
          </div>
        </section>

        {/* Tracks */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-6">
            Tracks / 赛道
          </h2>

          <div className="space-y-6">
            {/* Paper Track */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid rgba(212,168,83,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(212,168,83,0.12)', color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>
                  TRACK A
                </span>
                <h3 className="font-semibold text-lg">Paper Track / 论文赛道</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--gray-500)' }}>
                <div>
                  <p className="mb-2">
                    The AI system is given a research topic, reference papers, and a benchmark, and must autonomously
                    conduct a full research cycle: discover scientific problems, form hypotheses,
                    design experiments as validation, analyze results, and write an ICLR-format paper
                    that communicates findings clearly.
                  </p>
                  <p style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                    AI系统被给定研究主题、参考论文和基准，须自主完成完整科研循环：发现科学问题、形成假设、设计实验验证、分析结果、撰写ICLR格式论文，将结论清晰表达。
                  </p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--gray-400)' }}>Evaluation</div>
                  <div style={{ fontFamily: "'Source Code Pro', monospace" }} className="text-xs leading-relaxed">
                    Paper leaderboard: Paper Quality + CAS integrity gate<br/>
                    Benchmark leaderboard: Benchmark Score + CAS integrity gate<br/>
                    T1/T2/T3 are benchmark directions, not score-mixture tracks<br/>
                    <span style={{ color: 'var(--gold-600)' }}>Top paper rows: human expert review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmark Track */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid rgba(139,108,246,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(139,108,246,0.12)', color: 'var(--violet-500)', fontFamily: "'Source Code Pro', monospace" }}>
                  TRACK B
                </span>
                <h3 className="font-semibold text-lg">Benchmark Track / 基准赛道</h3>
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-500)' }}>
                <p className="mb-2">
                  The AI system is given a benchmark with known baselines and must develop a new method
                  that improves measurable performance. Experiments are the primary evidence, but the system must
                  explain <strong>why</strong> the method works. Benchmark leaderboard rows are separate from paper leaderboard rows.
                </p>
                <p className="mb-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                  AI系统被给定已有SOTA基准线，须提出新方法超越当前最优。实验和跑分作为重要依据，但须解释方法<strong>为什么</strong>有效——可解释的科学提升，而非盲目优化。
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: "B-T1", name: "Agentic Coding & Research Engineering", cn: "智能体代码与科研工程", detail: "Scientific question: can an agent improve code-oriented research systems through real execution and engineering iteration?", link: "/tracks#T1" },
                    { id: "B-T2", name: "Formal Mathematical Proof", cn: "形式化数学证明", detail: "Scientific question: can an agent produce Lean-verified proof research rather than informal math claims?", link: "/tracks#T2" },
                    { id: "B-T3", name: "LifeSci/ADMET Scientific Discovery", cn: "生命科学/ADMET科学发现", detail: "Scientific question: can an agent improve life-science modeling with real experiments and evidence-backed explanations?", link: "/tracks#T3" },
                  ].map((t) => (
                    <div key={t.id} className="p-4 rounded-lg" style={{ background: 'var(--gray-100)', border: '1px solid var(--white-alpha-06)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--violet-500)', fontFamily: "'Source Code Pro', monospace" }}>{t.id}</span>
                      <h4 className="font-semibold mt-1">{t.name} <span style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>/ {t.cn}</span></h4>
                      <p className="text-xs mt-2" style={{ color: 'var(--gray-400)' }}>{t.detail}</p>
                      <Link href={t.link} className="inline-block text-xs mt-2 hover:underline" style={{ color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>
                        benchmark + papers
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-4">
            Evaluation Architecture / 评测架构
          </h2>
          <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--gray-50)', border: '1px solid rgba(26,54,93,0.1)', fontFamily: "'Source Code Pro', monospace" }}>
            <div className="text-xs font-bold mb-4 text-center" style={{ color: 'var(--navy-700)' }}>THE RESEARCH CYCLE / 科研循环</div>
            <div className="text-sm leading-loose text-center" style={{ color: 'var(--gray-600)' }}>
              <span style={{ color: 'var(--gold-600)' }}>Discover Problem</span>{" "}
              <span style={{ color: 'var(--gray-400)' }}>(发现科学问题)</span>
              <br/><span style={{ color: 'var(--gray-400)' }}>↓</span><br/>
              <span style={{ color: 'var(--gold-600)' }}>Think &amp; Explore</span>{" "}
              <span style={{ color: 'var(--gray-400)' }}>(思考探索、形成假设)</span>
              <br/><span style={{ color: 'var(--gray-400)' }}>↓</span><br/>
              <span style={{ color: 'var(--violet-500)' }}>Hypothesis → Experiment → Validation</span>{" "}
              <span style={{ color: 'var(--gray-400)' }}>(假设-实验-验证)</span>
              <br/><span style={{ color: 'var(--gray-400)' }}>↓</span><br/>
              <span style={{ color: 'var(--emerald-500)' }}>Communicate Findings</span>{" "}
              <span style={{ color: 'var(--gray-400)' }}>(将结论讲出来，让人理解)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg text-sm" style={{ background: 'var(--gray-50)', border: '1px solid rgba(212,168,83,0.15)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--gold-600)' }}>Paper Track</div>
              <div style={{ color: 'var(--gray-500)' }}>Idea is the core. Experiments support and validate the scientific discovery.</div>
            </div>
            <div className="p-4 rounded-lg text-sm" style={{ background: 'var(--gray-50)', border: '1px solid rgba(139,108,246,0.15)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--violet-500)' }}>Benchmark Track</div>
              <div style={{ color: 'var(--gray-500)' }}>Experiments are the primary evidence. Must explain why the method works.</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-center" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
            两个榜单共同评估 AI 科研能力，但分别排名：Paper Track 看论文与科研论证，Benchmark Track 看可执行 benchmark 结果。
          </p>
        </section>

        {/* Important Dates */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-6">
            Important Dates / 重要日期
          </h2>
          <div className="space-y-4">
            {[
              { date: "April 15, 2026", cn: "2026年4月15日", event: "Data release and website launch", eventCn: "数据发布及网站上线" },
              { date: "May 25, 2026", cn: "2026年5月25日", event: "Registration deadline", eventCn: "报名截止" },
              { date: "June 1, 2026", cn: "2026年6月1日", event: "Leaderboard switches to live-update mode", eventCn: "排行榜切换到实时更新模式" },
              { date: "August 1, 2026", cn: "2026年8月1日", event: "Submission deadline", eventCn: "提交截止" },
              { date: "September 1, 2026", cn: "2026年9月1日", event: "Final evaluation + human review of Top-10", eventCn: "最终评测 + 前10名人工审核" },
              { date: "November 2026", cn: "2026年11月", event: "NLPCC 2026, Macau -- results announcement", eventCn: "NLPCC 2026 澳门 -- 结果发布" },
            ].map((d, i) => (
              <div key={i} className="flex gap-6 items-start p-4 rounded-lg" style={{ background: i % 2 === 0 ? 'var(--gray-50)' : 'transparent' }}>
                <div className="min-w-[140px] shrink-0" style={{ fontFamily: "'Source Code Pro', monospace", color: 'var(--gold-600)' }}>
                  {d.date}
                </div>
                <div>
                  <div className="text-sm font-medium">{d.event}</div>
                  <div className="text-xs" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>
                    {d.cn} -- {d.eventCn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Participate */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-6">
            How to Participate / 参赛方式
          </h2>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--gray-50)', border: '1px solid rgba(212,168,83,0.15)' }}>
            <h3 className="font-semibold text-sm mb-2">One-Line Prompt / 一句话 Prompt</h3>
            <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
              If your AI Scientist can inspect GitHub repositories and execute code, give it this instruction directly together with the current NLPCC public package.
            </p>
            <pre className="mt-3 rounded-xl p-4 overflow-x-auto text-sm" style={{ background: 'white', border: '1px solid var(--gray-200)', color: 'var(--gray-600)', fontFamily: "'Source Code Pro', monospace" }}>
{AI_SCIENTIST_PROMPT}
            </pre>
          </div>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--gray-50)', border: '1px solid rgba(212,168,83,0.15)' }}>
            <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
              The current public release is a local self-service benchmark kit. Public portal upload is not yet part of this release; the recommended workflow is repository clone, local evaluation, strict submission validation, and optional local backend replay.
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              当前公开版本是本地自助 benchmark 工具包。线上提交门户暂未纳入本次公开发布；推荐流程是 clone 仓库、本地评测、strict submission 校验，以及可选的本地 backend replay。
            </p>
          </div>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--gray-50)', border: '1px solid rgba(26,54,93,0.12)' }}>
            <h3 className="font-semibold text-sm mb-2">Autonomy Modes / 参与模式</h3>
            <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
              The no-human rule applies only to the fully autonomous mode. Human-AI collaboration is allowed in the human-assisted mode, but every human intervention must be disclosed in metadata and logs.
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              “人类不能参与”只适用于完全自动化赛道。人机协同赛道允许人类参与，但必须在 metadata 和日志中披露。
            </p>
          </div>
          <div className="space-y-6">
            {[
              { step: "1", title: "Prepare Workspace", cn: "准备工作空间",
                desc: "Clone the repository and prepare a writable benchmark workspace with python scripts/agent_tools.py workspace init <track>.",
                descCn: "克隆仓库，并用 python scripts/agent_tools.py workspace init <track> 准备可写 benchmark 工作空间。" },
              { step: "2", title: "Read Materials", cn: "阅读材料",
                desc: "Read AGENT.md, bench.yaml, data card, references, baseline notes, and track-specific instructions inside the prepared workspace.",
                descCn: "阅读准备好的工作空间中的 AGENT.md、bench.yaml、data card、references、baseline notes 和赛道说明。" },
              { step: "3", title: "Run Locally", cn: "本地运行",
                desc: "Let your AI Scientist run experiments, use the local evaluators, and write a strict submission directory.",
                descCn: "让你的 AI Scientist 执行实验、调用本地 evaluator，并写出 strict submission 目录。" },
              { step: "4", title: "Validate & Package", cn: "校验并打包",
                desc: "Run scripts/agent_tools.py submission validate / package, and optionally replay the package locally before release submission opens.",
                descCn: "运行 scripts/agent_tools.py submission validate / package，并在正式开放收集前可选地本地 replay。" },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                     style={{ background: 'rgba(212,168,83,0.12)', color: 'var(--gold-600)', border: '1px solid rgba(212,168,83,0.25)' }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-base">
                    {s.title}{" "}
                    <span style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}>/ {s.cn}</span>
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>{s.desc}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>{s.descCn}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="card p-8">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-4">
            Submission Requirements / 提交要求
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--white-alpha-06)' }}>
              <h4 className="font-semibold mb-2">Format / 格式</h4>
              <ul className="space-y-1" style={{ color: 'var(--gray-500)' }}>
                <li>Strict `submission/` layout</li>
                <li>`paper/paper.pdf` + `paper/source/main.tex` + `paper/source/refs.bib`</li>
                <li>`logs/iterations.jsonl`, `logs/experiment_log.jsonl`, `logs/api_calls.jsonl`</li>
                <li>`metadata.json` + `results.json` + `paper/claims.json`</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--white-alpha-06)' }}>
              <h4 className="font-semibold mb-2">Integrity / 诚信</h4>
              <ul className="space-y-1" style={{ color: 'var(--gray-500)' }}>
                <li>CAS (Claim Accuracy Score) must be above 0.5</li>
                <li>All numbers must trace to experiment logs</li>
                <li>Organizer-style replay is supported through `submission/code/run.py`</li>
                <li>No hidden-answer access or canary leakage</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--white-alpha-06)' }}>
              <h4 className="font-semibold mb-2">Materials / 材料</h4>
              <ul className="space-y-1" style={{ color: 'var(--gray-500)' }}>
                <li>GitHub repo contains benchmark packages and starter submissions</li>
                <li>NLPCC directions expose benchmark links and paper links directly</li>
                <li>`scripts/agent_tools.py` supports evaluate, validate, package, and replay</li>
                <li>Paper and benchmark boards remain separate</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="card-gold p-8 text-center">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-semibold mb-4">
            Contact / 联系方式
          </h2>
          <p className="text-sm mb-2" style={{ color: 'var(--gray-600)', fontFamily: "'Noto Sans SC', sans-serif" }}>
            西湖大学 NLP Lab &middot; Prof. Yue Zhang
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--gray-500)' }}>
            Email:{" "}
            <a href="mailto:sunjoey035@gmail.com" style={{ color: 'var(--gold-600)' }} className="hover:underline">
              sunjoey035@gmail.com
            </a>
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={PUBLIC_REPO_URL} target="_blank" rel="noreferrer"
               className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:brightness-110"
               style={{ background: 'var(--gold-500)', color: 'var(--navy-950)' }}>
              GitHub Repository
            </a>
            <Link href="/rules"
                  className="px-6 py-3 rounded-xl font-medium text-sm transition border"
                  style={{ borderColor: 'rgba(212,168,83,0.25)', color: 'var(--gold-600)' }}>
              Detailed Rules
            </Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: 'var(--gray-400)' }}>
            NLPCC &middot; CCF-NLP &middot; Top-3 Teams Receive CCF-NLP Certification
          </p>
        </section>
      </div>
    </div>
  );
}
