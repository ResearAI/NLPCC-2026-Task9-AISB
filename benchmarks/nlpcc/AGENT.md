# AISB/NLPCC Agent Quickstart

You are an AI Scientist agent running an AISB/NLPCC benchmark. Your goal is to produce a valid research submission, not only a benchmark score.

## Machine Requirements

Minimum:

- Docker Desktop or Docker Engine with Linux containers
- Python 3.11+
- 4 CPU cores
- 16 GB RAM
- 20 GB free disk for T1/T2, 40 GB free disk for T3

Recommended:

- 8 CPU cores
- 32 GB RAM
- 60 GB free disk
- Stable internet for literature/code search and model APIs
- At least 45 minutes wall-clock budget per direction/track/round for autonomous multi-round agents

Secrets:

- Set `HF_TOKEN` only if gated upstream data must be refreshed.
- Set your LLM/API provider keys as environment variables.
- Never write secrets into the submission package.

Autonomy mode:

- If `metadata.json.autonomy_level` is `fully_autonomous`, humans must not provide research decisions, debugging help, prompt edits, code edits, result selection, or paper-writing help after the run starts.
- If `metadata.json.autonomy_level` is `human_assisted`, human-AI collaboration is allowed, but every human intervention must be disclosed in `metadata.json.human_contributions` and logged in the research trace.
- Fully autonomous and human-assisted submissions should be treated as separate ranking/reporting categories.

Environment constraints:

- GPU is optional.
- Do not assume PyTorch is installed or importable. Prefer CPU-safe experiments unless your own environment explicitly verifies GPU/PyTorch support.
- T2 proof checking uses Lean `4.15.0` and Mathlib `v4.15.0` in the organizer Docker path. First checks may be slow; cache and log timeouts.
- T3 should default to CPU-safe `numpy`/`pandas`/`scikit-learn`/`RDKit` experiments unless the local environment explicitly verifies GPU support.
- If you run multiple rounds in parallel, use separate working directories and do not use global process cleanup scripts that can kill another run.
- If plot/VLM review is not configured, skip aggregate-plot stages rather than blocking the research loop.

## Tool-First Workflow

From the repository root, run:

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
```

Replace `T1` with `T2` or `T3` as needed.
The command creates a prepared benchmark workspace and places a valid starter submission template in `.work/<track>/submission/`. Treat it as a scaffold, not as a completed result.

You should then work inside the prepared workspace and use the public tools:

1. Read `.work/<track>/AGENT.md`, `bench.yaml`, `data/data.md`, and `references/papers.json`.
2. Run experiments and write your artifacts into `.work/<track>/submission/`.
3. Use `python scripts/agent_tools.py evaluate ...` for local scoring.
4. Use `python scripts/agent_tools.py submission validate ...` before packaging.
5. Use `python scripts/agent_tools.py submission package ...` to create the final `.zip`.
6. Use `python scripts/agent_tools.py submission replay ...` if you need organizer-style local replay.

For T1 engineering tasks:

```bash
python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
```

The lower-level `run_release_workflow.py --agent-cmd ...` path is reserved for human operators or adapter scripts that already know how to drive an external agent binary.

Do not wait for a human to operate the benchmark once your workspace is prepared. Your job is to use the provided materials and tools, run real experiments, write the strict submission directory, and call validation/package/replay tools yourself.

## What You Must Produce

Your command must write a valid submission directory at `AISB_SUBMISSION_DIR`:

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

If you want backend replay, also include:

```text
submission/
└── code/
    └── run.py
```

The backend replay stage looks for `code/run.py` first, then `run.py`.

The paper must be based on executed experiments. Do not write claims from speculation. Every important numerical claim must appear in `paper/claims.json` and trace to `logs/experiment_log.jsonl`.

Self-reported experiment metrics are not official hidden-test scores. Official benchmark scoring is produced by the backend evaluator after the package is validated.
For backend replay, inspect the returned `official_score`; leaderboard entries must use that value rather than `results.json`.

## Track Instructions

After the CLI prepares a track, read:

- `$AISB_BENCH_DIR/AGENT.md`
- `$AISB_BENCH_DIR/bench.yaml`
- `$AISB_BENCH_DIR/data/data.md`
- `$AISB_BENCH_DIR/references/papers.json`

## Integrity Rules

Do not access hidden answers, private evaluator files, or canary tokens. Failed experiments must be logged with `FAILED`, `ERROR`, or `TIMEOUT`; do not delete them to make the research process look cleaner.

Known runtime pitfalls to avoid:

- T1 reasoning experiments can exceed a 30 minute wall-clock cap; keep checkpoints and log partial failures.
- T2 proof repair loops must run actual Lean checks; do not report proof rates from simulated strings.
- T3 molecular experiments must handle invalid SMILES/RDKit warnings before drawing chemical conclusions.

Run this before final submission:

```bash
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
```
