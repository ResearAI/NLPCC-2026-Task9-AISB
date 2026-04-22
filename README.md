<div align="center">

# AISB: AI Scientist Benchmark

### NLPCC 2026 Shared Task 9

**Evaluating AI Systems as Autonomous Researchers**

**评测AI系统的自主科研能力**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Docker T1](https://img.shields.io/badge/Docker-T1%20Built-green)](tracks/shared/docker/Dockerfile.t1)
[![Docker T3](https://img.shields.io/badge/Docker-T3%20Built-green)](tracks/shared/docker/Dockerfile.t3)
[![Tests](https://img.shields.io/badge/Tests-15%2F15%20Pass-brightgreen)](tests/e2e/)

[English](#overview) | [中文](#概述) | [Getting Started](#getting-started--快速开始) | [Tracks](#tracks--赛道) | [Timeline](#timeline--时间线) | [Contact](#contact--联系方式)

</div>

---

## Overview

**AISB (AI Scientist Benchmark)** evaluates whether AI systems can conduct the full cycle of scientific research — not just solve tasks, but **discover problems, think, explore, and produce communicable knowledge**.

Given a research topic, reference papers, and benchmarks with known baselines, AI Scientist systems must autonomously:

1. **Discover scientific problems** — read literature, identify meaningful gaps, ask the right questions
2. **Think and explore** — form hypotheses, reason about why an approach should work
3. **Validate through experiments** — design and execute real experiments as hypothesis testing
4. **Communicate findings** — write a complete research paper that a human can understand, with traceable and reproducible results

The complete research cycle: **Idea + Experiment + Report**. AISB measures how well AI systems can do each part — and whether the whole is honest.

### Why Integrity Matters

73% of AI-generated papers fabricate results (MLR-Bench, NeurIPS 2025). Science without honesty is not science. AISB treats integrity as a **gate**: key numerical claims must be traceable to executed experiments, or the submission is rejected.

Public leaderboard policy:

```
Track A / Paper Track:
Final_A = 0.0 x S_benchmark + 1.0 x S_paper

Track B / Benchmark Track:
Final_B = 0.7 x S_benchmark + 0.3 x S_paper

S_paper = 0.30 x significance
        + 0.25 x originality
        + 0.25 x methodology/soundness
        + 0.20 x writing/clarity
```

`CAS` is not a bonus term in the public formula. It is an integrity gate. See `docs/SCORING_POLICY.md`.

---

## 概述

**AISB（AI Scientist Benchmark）** 评测AI系统的**自主科研能力** — 不只是解题，而是**发现问题、思考、探索、验证、表达**的完整科研循环。

给定研究主题、参考论文和已有基准，AI科学家系统须自主完成：

1. **发现科学问题** — 阅读文献，找到有意义的研究空白，提出正确的问题
2. **思考与探索** — 形成假设，推理方法为什么应该有效
3. **实验验证** — 设计并执行真实实验，作为假设的验证手段
4. **表达结论** — 将发现写成人类可理解的论文，结果可追溯、可复现

完整的科研循环：**Idea + Experiment + Report**。AISB 衡量AI在每个环节的能力，并验证整体的诚实性。

---

## Tracks / 赛道

### Track 1: Scientific Research / 科学研究赛道

**The core track.** The AI system reads papers, identifies gaps, proposes novel scientific questions, designs experiments to test hypotheses, and writes a research paper.

**核心赛道。** AI系统阅读论文、发现空白、提出新的科学问题、设计实验验证假设、撰写研究论文。

What we evaluate / 我们评估什么：

| Dimension | What it means | 含义 |
|-----------|--------------|------|
| **Scientific Question** | Does the AI ask a *meaningful* question? | AI是否提出了有意义的问题？ |
| **Interpretable Method** | Can it explain *why* the approach should work? | 能否解释方法*为什么*有效？ |
| **Phenomenon Explanation** | Does it discover *how* things work, not just *what* works? | 是否发现事物*如何*运作，而非仅仅*什么*有效？ |
| **Experimental Evidence** | Are hypotheses tested with real experiments? | 假设是否经过真实实验验证？ |
| **Honest Reporting** | Are failures reported? Are numbers real? | 失败是否报告？数据是否真实？ |

Example tasks include: *"Do features truly interact in noisy classification, and how?"*, *"Which anomaly detection methods fail on which time series characteristics, and why?"*

### Track 2: Benchmark SOTA Challenge / 基准提升赛道

The AI system proposes a novel method to improve over known SOTA baselines. The key differentiator from standard leaderboard competitions: **you must explain why your method works**, not just that it works.

AI系统提出新方法提升现有SOTA基准线。与标准排行榜竞赛的关键区别：**你必须解释方法为什么有效**，而不仅仅是有效。

| Sub-track | Benchmark | SOTA | What we look for |
|-----------|-----------|------|-----------------|
| T1: AI/CS Reasoning & Engineering | HLE-Verified (50q) + FeatureBench (20 tasks) | 37-45% / 12.5% | Scientific reasoning strategy, not prompt tricks |
| T2: Formal Math Proof | FormalMATH (50 problems, Lean4) | 28.3% Pass@32 | Proof methodology, not brute-force search |
| T3: Scientific Discovery | TDC ADMET (5 endpoints) + Matbench Discovery | varies / F1=0.924 | Domain-informed approach, not AutoML |

**Scoring**: Track A (Paper) = 0.0 x S_benchmark + 1.0 x S_paper. Track B (Benchmark) = 0.7 x S_benchmark + 0.3 x S_paper.

**Direction weights**: T1 : T2 : T3 = 0.35 : 0.35 : 0.30

### Autonomy Levels / 自主性级别

| Level | Description | Award |
|-------|-------------|-------|
| `fully_autonomous` | Zero human intervention | Best Autonomous System |
| `human_assisted` | Human provides guidance (must describe) | Best Human-AI Collaboration |

---

## Getting Started / 快速开始

For an AI Scientist agent, give it [benchmarks/nlpcc/README.md](benchmarks/nlpcc/README.md), [benchmarks/nlpcc/AGENT.md](benchmarks/nlpcc/AGENT.md), and the track-specific `AGENT.md`.

Minimum local machine:

- Docker Desktop or Docker Engine with Linux containers
- Python 3.11+
- 4 CPU cores, 16 GB RAM
- 20 GB free disk for T1/T2, 40 GB free disk for T3

```bash
# 1. Prepare a writable benchmark workspace / 准备可写 benchmark 工作空间
python scripts/agent_tools.py workspace init T1 --dest .work/T1

# 2. Run local task/evaluation tools as needed / 按需运行本地任务与评测工具
python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission

# 3. Validate and package the final submission / 校验并打包最终提交
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission

# 4. Optional local organizer-style replay / 可选：本地模拟组织方 replay
python scripts/agent_tools.py submission replay .work/T1/submission --track T1
```

See `benchmarks/nlpcc/T1`, `benchmarks/nlpcc/T2`, and `benchmarks/nlpcc/T3` for benchmark packages and starter submissions.

Organizer-side integration results from a real AI Scientist v2 / GLM 5.1 matrix run are recorded in [benchmarks/nlpcc/VALIDATION_REPORT_20260413.md](benchmarks/nlpcc/VALIDATION_REPORT_20260413.md). These are integration results, not official hidden-test leaderboard scores.

---

## Submission Format / 提交格式

```
submission/
├── metadata.json              # Team info, track (paper/benchmark; legacy A/B accepted), direction (T1/T2/T3), autonomy_level
├── results.json               # Benchmark result summary
├── code/                      # Optional backend replay entrypoint
│   └── run.py                 # Preferred; root-level run.py is also accepted
├── paper/
│   ├── paper.pdf              # Final research paper
│   ├── source/
│   │   ├── main.tex           # LaTeX source
│   │   ├── refs.bib           # Bibliography
│   │   └── figures/           # pdf/png/jpg figures
│   └── claims.json            # Structured numerical claims for CAS
└── logs/
    ├── iterations.jsonl       # Research-loop log
    ├── experiment_log.jsonl   # CAS source of truth
    └── api_calls.jsonl        # API/model call log, or no-op record
```

The same structure is enforced by `tracks/shared/SUBMISSION_STANDARD.md`, `scripts/verify_submission.py`, and the `aisb submit` CLI. For backend `--execute-submission`, include `submission/code/run.py` or `submission/run.py`.

Public scoring and reviewer policy are documented in `docs/SCORING_POLICY.md` and `docs/REVIEW_GUIDE.md`.

**Network**: Agents may use the internet for legitimate paper/code/API access in the allowed phase. Directly searching for benchmark answers or accessing hidden labels/canaries is strictly forbidden and detectable.

---

## Evaluation Pipeline / 评测流程

```
Stage 1  Format Validation      metadata, logs, paper
Stage 2  Security Pre-Scan      prompt injection, code analysis
Stage 3  Container Preparation  canary injection, git sanitization
Stage 4  Sandboxed Execution    Docker (--network none, --read-only, seccomp, monitoring)
Stage 5  Integrity Check        CAS verification, canary scan, fabrication detection
```

---

## Timeline / 时间线

| Date | Milestone | 里程碑 |
|------|-----------|--------|
| Apr 15, 2026 | Public repository + website release | 仓库与官网公开 |
| May 25, 2026 | Registration / interest deadline | 报名 / 意向登记截止 |
| Jun 1, 2026 | Leaderboard switches to live-update mode | 排行榜切换到实时更新模式 |
| **Aug 1, 2026** | **Submission deadline** | **提交截止** |
| Sep 2026 | Final evaluation + integrity review | 最终评测 + 诚信审查 |
| Nov 2026 | NLPCC 2026, Macau | NLPCC 2026 澳门 |

---

## Baseline Status / 基准状态

The public release ships organizer baselines and local replay tools, but the
website leaderboard currently stays in `ready / live-update later` mode.

- `T1`: runnable HLE + FeatureBench-lite local baseline
- `T2`: runnable deterministic Lean router baseline
- `T3`: public baseline kept local until live-update mode opens

---

## Repository Structure / 仓库结构

```
├── tracks/shared/
│   ├── docker/        # Evaluation containers + security config
│   ├── security/      # 5-stage evaluation pipeline
│   ├── integrity/     # CAS, fabrication detection, prompt injection
│   ├── logging/       # API call + conversation logging
│   └── review/        # AI paper reviewer (DeepReviewer-v2 + OpenReviewer)
├── tracks/paper_track/    # 7 scientific research tasks
├── data/competition/      # Dev sets (T1: HLE, T3: TDC ADMET)
├── scripts/               # Data download, submission verification
├── examples/              # Starter code
├── tests/e2e/             # 15 tests (10 static + 5 Docker)
└── docs/                  # Documentation
```

---

## Organizers / 组织者

**WestlakeNLP, Westlake University** (西湖大学自然语言处理实验室)

## Contact / 联系方式

- **Qiyao SUN** (孙启耀): sunjoey035@gmail.com — Contact Person / 联络人
- **Yue ZHANG** (张岳) — Project Advisor / 项目指导
- **Yixuan WENG** (翁诣轩), **Minjun ZHU** (朱敏郡), **Qiujie XIE** (谢秋婕), **Zhen LIN** (林圳)

## Citation

```bibtex
@inproceedings{aisb2026,
  title={AISB: AI Scientist Benchmark — Evaluating Autonomous Research Capability},
  author={Sun, Qiyao and Weng, Yixuan and Zhu, Minjun and Xie, Qiujie and Lin, Zhen and Zhang, Yue},
  booktitle={NLPCC 2026 Shared Tasks},
  year={2026},
  organization={Westlake University}
}
```

## License

Apache License 2.0. Individual benchmark datasets may have their own licenses.
