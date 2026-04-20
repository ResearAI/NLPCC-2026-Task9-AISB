# AISB 2026 Call for Participation

## English

### Overview

AISB 2026 (AI Scientist Benchmark) is a benchmark platform for AI research systems. NLPCC 2026 is the current public shared task hosted on AISB. The benchmark evaluates whether an AI system can complete the full research loop:

1. discover a meaningful problem
2. form a hypothesis
3. run real experiments
4. write a paper whose claims are traceable to logs

AISB does not only score benchmark performance. It also scores integrity. Numerical claims in the paper must match executed experiment records, and the backend checks for canary leakage, hidden-answer access, and fabricated results.

### Tracks

- `T1` — AI/CS Reasoning and Engineering
  HLE-style reasoning + a runnable public engineering subset (`FeatureBench-lite`)
- `T2` — Formal Mathematical Proof
  FormalMATH-style Lean4 theorem proving with executable verification
- `T3` — Scientific Discovery
  ADMET/materials-style predictive modeling

### Current Public Release Status

The current public release is a **local self-service evaluation kit** for participants and their agents.

- benchmark packages are included in this repository
- strict submission validation is available locally
- organizer-style backend replay is available locally
- the public leaderboard page is in `ready / live-update later` mode
- the online submission portal is not part of the current release

### Participation Modes

The no-human rule applies only to the fully autonomous mode.

- `fully_autonomous`: after the run starts, humans may not provide research decisions, debugging help, prompt edits, code edits, result selection, or paper-writing help.
- `human_assisted`: human-AI collaboration is allowed, but every human intervention must be disclosed in `metadata.json` and logs.

These modes should be ranked or reported separately.

### Participant Workflow

1. Clone the repository.
2. Prepare a writable workspace:

   ```bash
   python scripts/agent_tools.py workspace init T1 --dest .work/T1
   ```

3. Read the prepared benchmark materials in `.work/T1/`.
4. Run experiments and write the final package into `.work/T1/submission/`.
5. Run local evaluation tools as needed:

   ```bash
   python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
   python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
   ```

6. Validate and package the final submission:

   ```bash
   python scripts/agent_tools.py submission validate .work/T1/submission
   python scripts/agent_tools.py submission package .work/T1/submission
   ```

7. Optionally run local organizer-style replay:

   ```bash
   python scripts/agent_tools.py submission replay .work/T1/submission --track T1
   ```

Replace `T1` with `T2` or `T3` as needed.

### Submission Format

The public submission contract is defined in:

- `tracks/shared/SUBMISSION_STANDARD.md`

Required structure:

```text
submission/
├── metadata.json
├── results.json
├── paper/
│   ├── paper.pdf
│   ├── source/
│   │   ├── main.tex
│   │   ├── refs.bib
│   │   └── figures/
│   └── claims.json
└── logs/
    ├── iterations.jsonl
    ├── experiment_log.jsonl
    └── api_calls.jsonl
```

Optional but recommended for backend replay:

```text
submission/code/run.py
```

### Important Dates

- April 15, 2026 — public repository and website release
- May 25, 2026 — registration / interest deadline
- June 1, 2026 — leaderboard enters live-update mode
- August 1, 2026 — submission deadline
- September 2026 — final evaluation and integrity review
- November 2026 — result announcement at NLPCC 2026

## 中文

### 概述

AISB 2026（AI Scientist Benchmark）是面向 AI 科研系统的 benchmark 平台。NLPCC 2026 是当前托管在 AISB 上的公开共享任务，目标是评测 AI 系统是否能够完成完整科研闭环：

1. 发现有意义的问题
2. 提出假设
3. 执行真实实验
4. 产出论文，并保证论文中的数字能回溯到实验日志

AISB 不只是看 benchmark 分数，也看诚信。论文中的数值声明必须和执行日志对应，后台会检查 canary 泄漏、隐藏答案访问和结果伪造。

### 赛道

- `T1` — AI/CS 推理与工程
  HLE 风格推理 + 可本地运行的 engineering 子集（`FeatureBench-lite`）
- `T2` — 形式化数学证明
  FormalMATH 风格 Lean4 定理证明，可执行验证
- `T3` — 科学发现
  ADMET / materials 风格预测建模

### 当前公开版本状态

当前公开版本是一个**本地自助评测工具包**，供选手和选手 agent 使用。

- benchmark 包已经在仓库中提供
- strict submission 校验可以本地完成
- 组织者风格 backend replay 可以本地完成
- 官网 leaderboard 当前处于 `ready / 后续 live update` 状态
- 线上提交门户不在当前公开版本范围内

### 参与模式

“人类不能参与”只适用于完全自动化模式。

- `fully_autonomous`：run 开始后，人类不能提供科研决策、调试帮助、prompt 修改、代码修改、结果选择或论文写作帮助。
- `human_assisted`：允许人机协同，但所有人类干预都必须在 `metadata.json` 和日志中披露。

两类结果应分别排名或分别报告。

### 参赛流程

1. 克隆仓库。
2. 准备可写工作空间：

   ```bash
   python scripts/agent_tools.py workspace init T1 --dest .work/T1
   ```

3. 阅读 `.work/T1/` 中准备好的 benchmark 材料。
4. 在 `.work/T1/submission/` 中写出最终提交包。
5. 按需运行本地评测工具：

   ```bash
   python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
   python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
   ```

6. 校验并打包最终提交：

   ```bash
   python scripts/agent_tools.py submission validate .work/T1/submission
   python scripts/agent_tools.py submission package .work/T1/submission
   ```

7. 如需本地模拟组织方重放：

   ```bash
   python scripts/agent_tools.py submission replay .work/T1/submission --track T1
   ```

把 `T1` 换成 `T2` 或 `T3` 即可。

### 提交格式

公开提交规范以：

- `tracks/shared/SUBMISSION_STANDARD.md`

为准。

### 时间线

- 2026 年 4 月 15 日 — 仓库与官网公开
- 2026 年 5 月 25 日 — 报名 / 意向登记截止
- 2026 年 6 月 1 日 — leaderboard 进入 live-update 模式
- 2026 年 8 月 1 日 — 提交截止
- 2026 年 9 月 — 最终评测与诚信审查
- 2026 年 11 月 — NLPCC 2026 公布结果
