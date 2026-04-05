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

Given a research topic, reference papers (8 per direction, including provocative findings), and benchmarks with known baselines, AI Scientist systems must independently complete this full research cycle.

### Three Directions

| Direction | Domain | Benchmarks | SOTA | Headroom |
|-----------|--------|-----------|------|----------|
| **T1** | AI/CS Reasoning & Engineering | HLE-Verified (50q) + FeatureBench (20 tasks) | 37-45% / 12.5% | High |
| **T2** | Formal Mathematical Proof | FormalMATH (50 problems, Lean4) | 28.3% Pass@32 | High |
| **T3** | Scientific Discovery | TDC ADMET (5 endpoints) + Matbench Discovery | varies / F1=0.924 | High |

### Cost

Using DeepSeek V3, participants can run all three directions for **$5.5-14.5** per submission — extremely student-friendly.

---

## 任务描述

**AISB（AI科学家基准测试）** 评测AI系统的**自主科研能力** — 完整的科学发现循环：

1. **发现科学问题** — 阅读文献，找到有意义的研究空白
2. **思考与探索** — 形成假设，推理方法为什么有效
3. **实验验证** — 在真实基准上用真实代码测试假设
4. **表达结论** — 写成ICLR格式研究论文，让人类能理解并复现

每个方向提供 8 篇参考论文（含 3 篇"挑战性发现"），鼓励参赛者不仅优化分数，更要思考这些发现对方法设计的启示。

---

## Tracks / 赛道

### Track A: Scientific Research / 科研探索赛道

The AI conducts a full research cycle: read papers, discover problems, design experiments, write paper.

**Scoring**: `Final = 0.3 × S_benchmark × R_reproduce + 0.7 × S_paper`

S_paper = 0.30×Significance + 0.25×Novelty + 0.25×Methodology + 0.20×Writing

AI reviewers (Stanford Agentic Reviewer + DeepReviewer V2) score papers automatically. **Top-10 receive human expert review.**

### Track B: SOTA Challenge / 基准提升赛道

The AI proposes a novel method that improves over current SOTA. Must explain *why* the method works.

**Scoring**: `Final = 0.7 × S_benchmark × R_reproduce + 0.3 × S_paper`

### Direction Weights

T1 : T2 : T3 = **0.35 : 0.35 : 0.30**

### Autonomy Categories (separate awards)

| Category | Description |
|----------|-------------|
| **Fully Autonomous** | Zero human intervention during research |
| **Human-Assisted** | Human provides guidance (must describe contributions) |

---

## Reference Papers / 参考论文

Each direction includes **8 papers** (5 methods + 3 provocative findings):

### T1: AI/CS Reasoning & Engineering
1. Humanity's Last Exam — Nature 2026 (arXiv:2501.14249)
2. HLE-Verified — arXiv:2602.13964
3. FeatureBench — ICLR 2026 (arXiv:2602.10975)
4. s1: Simple Test-Time Scaling — EMNLP 2025 (arXiv:2501.19393)
5. DeepSeek-R1 — Nature 2026 (arXiv:2501.12948)
6. *"Does RL Really Incentivize Reasoning?"* — NeurIPS'25 Oral (arXiv:2504.13837)
7. *"The Illusion of Thinking"* — Apple (arXiv:2506.06941)
8. *"Reasoning Models Don't Always Say What They Think"* — Anthropic (arXiv:2505.05410)

### T2: Formal Mathematical Proof
1. DeepSeek-Prover-V2 — arXiv:2504.21801
2. Goedel-Prover-V2 — arXiv:2508.03613
3. Kimina-Prover — arXiv:2504.11354
4. FormalMATH — arXiv:2505.02735
5. Seed-Prover 1.5 — arXiv:2512.17260
6. *HorizonMath* — arXiv:2603.15617
7. *Aristotle (Harmonic)* — arXiv:2510.01346
8. *AlphaProof* — Nature 2025

### T3: Scientific Discovery
1. TDC — NeurIPS 2021 (arXiv:2102.09548)
2. TDC-2 — bioRxiv 2024
3. Matbench Discovery — Nature Machine Intelligence 2025
4. AlphaFold 3 — Nature 2024
5. RFdiffusion2 — Nature Methods 2026
6. *IsoDDE ("AlphaFold4")* — Isomorphic Labs 2026
7. *Rentosertib Phase IIa* — Nature Medicine 2025
8. *"The AI Drug Revolution Needs a Revolution"* — npj Drug Discovery 2025

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

Both tracks **allow internet access**. AI systems may download papers, use APIs, install packages. **Directly searching for benchmark answers is strictly forbidden** — detectable via CAS and canary tokens → immediate disqualification.

### Pass@k

- **k=3** submissions allowed (3 seeds)
- Reported: **Best@3** (main ranking), Mean@3, Pass@1

### Integrity

Every numerical claim must trace to experiment logs (CAS). CAS < 0.5 = disqualified.

---

## Recommended Systems / 推荐系统

| System | Paper | Cost |
|--------|-------|------|
| AI Scientist v2 (Sakana) | arXiv:2504.08066 | ~$15/paper |
| AI-Researcher (HKU) | arXiv:2505.18705 | API only |
| Agent Laboratory (JHU) | arXiv:2501.04227 | ~$2.33/paper |
| AIDE (Weco AI) | GitHub | API only |
| Claude Code / Codex | CLI tools | API only |

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
