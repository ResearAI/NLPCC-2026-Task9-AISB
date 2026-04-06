import Image from "next/image";
import Link from "next/link";

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
          NLPCC 2026 Shared Task
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
                <strong>AISB (AI Scientist Benchmark)</strong> evaluates AI systems as autonomous researchers —
                the complete cycle of <strong style={{ color: 'var(--gold-600)' }}>Idea + Experiment + Report</strong>.
                Given a research topic and reference papers, AI systems must discover scientific problems,
                form hypotheses, validate through experiments, and communicate findings in a paper humans can understand.
              </p>
              <p className="mb-4">
                As an NLPCC 2026 Shared Task, AISB invites participants to develop AI systems that
                autonomously conduct scientific research across 12 directions and 117 benchmarks.
                Integrity verification (CAS) ensures all claimed results are real, not fabricated.
              </p>
              <p>
                Organized by Westlake University NLP Lab under the supervision of Prof. Yue Zhang.
                Top-3 teams receive CCF-NLP certification.
              </p>
            </div>
            <div style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              <p className="mb-4">
                <strong>AISB（AI科学家基准测试）</strong>评测AI系统的自主科研能力——
                完整的<strong style={{ color: 'var(--gold-600)' }}>Idea + Experiment + Report</strong>循环。
                给定研究主题和参考论文，AI系统须发现科学问题、形成假设、通过实验验证、并将结论写成人类可理解的论文。
              </p>
              <p className="mb-4">
                作为 NLPCC 2026 共享任务，AISB 邀请参赛者开发能够跨12个研究方向、117个基准测试
                自主进行科学研究的AI系统。CAS（声明准确度分数）确保所有声称的结果真实可追溯。
              </p>
              <p>
                由西湖大学 NLP 实验室组织，张岳教授指导。前三名团队获得 CCF-NLP 认证。
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
            {/* Track A */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid rgba(212,168,83,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(212,168,83,0.12)', color: 'var(--gold-600)', fontFamily: "'Source Code Pro', monospace" }}>
                  TRACK A
                </span>
                <h3 className="font-semibold text-lg">Track 1: Scientific Research / 科学研究赛道</h3>
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
                    Dual Score = 0.4 x PQS + 0.3 x CAS + 0.2 x BI + 0.1 x ESR<br/>
                    PQS: Paper Quality Score (innovation, originality)<br/>
                    CAS: Claim Accuracy Score (paper vs logs)<br/>
                    BI: Benchmark Improvement<br/>
                    ESR: Experiment Success Rate<br/>
                    <span style={{ color: 'var(--gold-600)' }}>Top-10: human expert review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Track B */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid rgba(139,108,246,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(139,108,246,0.12)', color: 'var(--violet-500)', fontFamily: "'Source Code Pro', monospace" }}>
                  TRACK B
                </span>
                <h3 className="font-semibold text-lg">Track 2: Benchmark SOTA Challenge / 基准提升赛道</h3>
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-500)' }}>
                <p className="mb-2">
                  The AI system is given a benchmark with known SOTA baselines and must develop a new method
                  that improves over current SOTA. Experiments are the primary evidence, but the system must
                  explain <strong>why</strong> the method works — interpretable improvement, not blind optimization.
                </p>
                <p className="mb-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                  AI系统被给定已有SOTA基准线，须提出新方法超越当前最优。实验和跑分作为重要依据，但须解释方法<strong>为什么</strong>有效——可解释的科学提升，而非盲目优化。
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: "B-T1", name: "AI/CS Reasoning & Engineering", cn: "推理与工程", detail: "HLE-Verified 50q + FeatureBench 20 tasks", baseline: "SOTA: 37-45% / 12.5%" },
                    { id: "B-T2", name: "Math & Proof", cn: "数学证明", detail: "FormalMATH 50 problems (Lean4)", baseline: "Baseline: 28% (DeepSeek-Prover)" },
                    { id: "B-T3", name: "Scientific Discovery", cn: "科学发现", detail: "TDC ADMET 5 endpoints + Matbench", baseline: "Baseline: MAE 0.93" },
                  ].map((t) => (
                    <div key={t.id} className="p-4 rounded-lg" style={{ background: 'var(--gray-100)', border: '1px solid var(--white-alpha-06)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--violet-500)', fontFamily: "'Source Code Pro', monospace" }}>{t.id}</span>
                      <h4 className="font-semibold mt-1">{t.name} <span style={{ color: 'var(--gray-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>/ {t.cn}</span></h4>
                      <p className="text-xs mt-2" style={{ color: 'var(--gray-400)' }}>{t.detail}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--gray-400)', fontFamily: "'Source Code Pro', monospace" }}>{t.baseline}</p>
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
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--gold-600)' }}>Track 1: Scientific Research</div>
              <div style={{ color: 'var(--gray-500)' }}>Idea is the core. Experiments support and validate the scientific discovery.</div>
            </div>
            <div className="p-4 rounded-lg text-sm" style={{ background: 'var(--gray-50)', border: '1px solid rgba(139,108,246,0.15)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--violet-500)' }}>Track 2: SOTA Challenge</div>
              <div style={{ color: 'var(--gray-500)' }}>Experiments are the primary evidence. Must explain why the method works.</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-center" style={{ color: 'var(--gray-500)', fontFamily: "'Noto Sans SC', sans-serif" }}>
            两个赛道共同评估AI的自主科研能力，差异在于侧重点：Track 1 以idea为核心，Track 2 以实验为核心。
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
              { date: "June 1, 2026", cn: "2026年6月1日", event: "Validation leaderboard opens", eventCn: "验证集排行榜开放" },
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
          <div className="space-y-6">
            {[
              { step: "1", title: "Register", cn: "注册",
                desc: "Register via Google Form (https://forms.gle/9oWtS77UduudpRM1A), then create a HuggingFace account.",
                descCn: "通过 Google Form 注册（https://forms.gle/9oWtS77UduudpRM1A），然后创建 HuggingFace 账户。" },
              { step: "2", title: "Download Data", cn: "下载数据",
                desc: "Run our download script: python scripts/download_competition_data.py --all",
                descCn: "运行数据下载脚本获取所有赛道数据。" },
              { step: "3", title: "Develop Your AI Scientist", cn: "开发 AI 科学家系统",
                desc: "Build a system that designs research strategies for the fixed executor. Test locally with the dev set.",
                descCn: "开发为固定执行器设计研究策略的系统，使用开发集本地测试。" },
              { step: "4", title: "Submit", cn: "提交",
                desc: "Package your system as submission.tar.gz and upload via our HuggingFace Space.",
                descCn: "将系统打包为 submission.tar.gz 并通过 HuggingFace Space 提交。" },
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
                <li>ICLR format paper (paper.md or paper.tex)</li>
                <li>Complete executable code</li>
                <li>Standardized iterations.jsonl log</li>
                <li>metadata.json with team info</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--white-alpha-06)' }}>
              <h4 className="font-semibold mb-2">Integrity / 诚信</h4>
              <ul className="space-y-1" style={{ color: 'var(--gray-500)' }}>
                <li>CAS (Claim Accuracy Score) must be above 0.5</li>
                <li>All numbers must trace to experiment logs</li>
                <li>Docker sandbox execution</li>
                <li>No network access during evaluation</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--white-alpha-06)' }}>
              <h4 className="font-semibold mb-2">Resources / 资源</h4>
              <ul className="space-y-1" style={{ color: 'var(--gray-500)' }}>
                <li>API budget: $10-$30 per track</li>
                <li>Wall-clock: 30min - 2hr per track</li>
                <li>Fixed executor (same for all teams)</li>
                <li>1 submission per day per track</li>
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
            <a href="https://github.com/giao-123-sun/AISB_2026" target="_blank" rel="noreferrer"
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
