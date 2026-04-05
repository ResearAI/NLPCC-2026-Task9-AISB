<div align="center">

# NLPCC 2026 Shared Task 9: AISB

### AI Scientist Benchmark — Evaluating Autonomous Research Capability

**AI系统能否自主进行科学研究？发现问题、思考探索、实验验证、表达结论。**

[![Website](https://img.shields.io/badge/Website-Live-blue)](https://researai.github.io/NLPCC-2026-Task9-AISB/)
[![Platform](https://img.shields.io/badge/Platform-Codabench-orange)](https://codabench.org)

[English](#task-description) | [中文](#任务描述) | [Tracks](#tracks--赛道) | [Timeline](#timeline--时间线) | [Submission](#submission--提交) | [Contact](#contact--联系方式)

</div>

---

## Task Description

**AISB (AI Scientist Benchmark)** evaluates AI systems as **autonomous researchers** — the complete cycle of scientific discovery:

1. **Discover problems** — read literature, identify meaningful research gaps
2. **Think and explore** — form hypotheses, reason about approaches
3. **Validate through experiments** — test hypotheses with real code on real benchmarks
4. **Communicate findings** — write a research paper (ICLR format) that humans can understand and reproduce

Given a research topic, reference papers (including provocative findings that challenge mainstream assumptions), and benchmarks with known baselines, AI Scientist systems must independently complete this full research cycle.

### Three Directions

| Direction | Domain | Benchmarks |
|-----------|--------|-----------|
| **T1** | AI/CS Reasoning & Engineering | [HLE-Verified](https://arxiv.org/abs/2602.13964) + [FeatureBench](https://arxiv.org/abs/2602.10975) |
| **T2** | Formal Mathematical Proof | [FormalMATH](https://arxiv.org/abs/2505.02735) (Lean4) |
| **T3** | Scientific Discovery | [TDC ADMET](https://tdcommons.ai) + [Matbench Discovery](https://matbench-discovery.materialsproject.org) |

All three directions feature recent benchmarks (2025-2026) with significant headroom — current SOTA is far from solved.

---

## 任务描述

**AISB（AI科学家基准测试）** 评测AI系统的**自主科研能力** — 完整的科学发现循环：

1. **发现科学问题** — 阅读文献，找到有意义的研究空白
2. **思考与探索** — 形成假设，推理方法为什么有效
3. **实验验证** — 在真实基准上用真实代码测试假设
4. **表达结论** — 写成ICLR格式研究论文，让人类能理解并复现

每个方向提供参考论文（含挑战主流假设的"挑战性发现"），鼓励参赛者不仅优化分数，更要思考这些发现对方法设计的启示。

---

## Tracks / 赛道

### Track A: Scientific Research / 科研探索赛道

The AI conducts a full research cycle: read papers, discover problems, design experiments, write paper.

**Scoring** based on: paper quality (significance, novelty, methodology, writing) + benchmark performance + reproducibility (CAS). Paper quality is the primary component. Top-10 receive human expert review.

### Track B: SOTA Challenge / 基准提升赛道

The AI proposes a novel method that improves over current SOTA. Must explain *why* the method works.

**Scoring** based on: benchmark performance + paper quality + reproducibility (CAS). Benchmark score is the primary component.

### Autonomy Categories (separate awards / 独立评奖)

| Category | Description |
|----------|-------------|
| **Fully Autonomous** | Zero human intervention during research |
| **Human-Assisted** | Human provides guidance (must describe contributions) |

---

## Reference Papers / 参考论文

Each direction includes reference papers (methods + provocative findings):

### T1: AI/CS Reasoning & Engineering
- Humanity's Last Exam — Nature 2026
- HLE-Verified — arXiv:2602.13964
- FeatureBench — ICLR 2026
- s1: Simple Test-Time Scaling — EMNLP 2025
- DeepSeek-R1 — Nature 2026
- *"Does RL Really Incentivize Reasoning?"* — NeurIPS'25 Oral
- *"The Illusion of Thinking"* — Apple
- *"Reasoning Models Don't Always Say What They Think"* — Anthropic

### T2: Formal Mathematical Proof
- DeepSeek-Prover-V2, Goedel-Prover-V2, Kimina-Prover, FormalMATH, Seed-Prover 1.5
- *HorizonMath*, *Aristotle (Harmonic)*, *AlphaProof*

### T3: Scientific Discovery
- TDC, TDC-2, Matbench Discovery, AlphaFold 3, RFdiffusion2
- *IsoDDE ("AlphaFold4")*, *Rentosertib Phase IIa*, *"The AI Drug Revolution Needs a Revolution"*

Full paper details with URLs: [data/references/](data/references/)

---

## Timeline / 时间线

| Date | Milestone | 里程碑 |
|------|-----------|--------|
| **Jun 2026** | Announcement + Registration | 竞赛公告+注册 |
| **Jul 2026** | Task packages released | 任务包发布(数据+论文+baseline) |
| **Aug 2026** | Development + Codabench leaderboard | 开发阶段+排行榜 |
| **Sep 2026** | Evaluation phase (held-out test) | 评测阶段 |
| **Oct 1, 2026** | Submission deadline (Best@3) | 提交截止 |
| **Oct 15, 2026** | Results published | 结果公布 |
| **Nov 2026** | NLPCC 2026, Macau | 澳门颁奖 |

---

## Submission / 提交

Submit via **Codabench** (codabench.org):

```
submission/
├── metadata.json            # Team info, track (A/B), direction (T1/T2/T3), autonomy level
├── paper.pdf                # Research paper (ICLR format)
├── scores.json              # Benchmark scores
├── code_repo_url.txt        # Code repository URL
└── logs/
    └── experiment_log.jsonl  # Experiment log (for integrity verification)
```

### Network Policy

Both tracks **allow internet access**. AI systems may download papers, use APIs, install packages.

**Directly searching for benchmark answers is strictly forbidden** — detectable and results in immediate disqualification.

### Integrity

Every numerical claim must trace to experiment logs (CAS). Fabrication = disqualified.

---

## Recommended Systems / 推荐系统

| System | Link | Description |
|--------|------|-------------|
| **DeepScientist v1.5** (ResearAI) | [GitHub](https://github.com/ResearAI/DeepScientist) | Local-first AI research studio. ICLR 2026. 13 built-in research skills. |
| AI Scientist v2 (Sakana) | [arXiv:2504.08066](https://arxiv.org/abs/2504.08066) | Tree search (BFTS) based research agent |
| AI-Researcher (HKU) | [arXiv:2505.18705](https://arxiv.org/abs/2505.18705) | 6-phase research pipeline. NeurIPS'25 Spotlight. |
| Agent Laboratory (JHU) | [arXiv:2501.04227](https://arxiv.org/abs/2501.04227) | Lightweight research agent |
| AIDE (Weco AI) | [GitHub](https://github.com/WecoAI/aideml) | Tree search in code |
| Claude Code / Codex | CLI tools | General-purpose coding agents |

---

## Organizers / 组织者

**WestlakeNLP, Westlake University** (西湖大学自然语言处理实验室)

## Contact / 联系方式

- **Qiyao SUN** (孙启耀): sunjoey035@gmail.com
- **Yue ZHANG** (张岳): Westlake University

## Citation

```bibtex
@inproceedings{aisb2026,
  title={AISB: AI Scientist Benchmark — Evaluating Autonomous Research Capability},
  author={Sun, Qiyao and Zhang, Yue},
  booktitle={NLPCC 2026 Shared Tasks},
  year={2026}
}
```
