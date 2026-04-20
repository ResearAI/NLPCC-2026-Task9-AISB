# AISB/NLPCC Release Package

This directory is the public NLPCC-facing AISB reduced release. It contains three research directions and two tracks per direction:

- T1: AI/CS reasoning and engineering
- T2: formal mathematical proof with Lean4-style verification
- T3: scientific discovery on ADMET/materials-style data
- Paper leaderboard: paper quality, research insight, claim traceability, and CAS integrity
- Benchmark leaderboard: executable benchmark score, reproducibility, and CAS integrity

T1/T2/T3 are benchmark directions. Paper and benchmark rankings are separate leaderboards, not a fixed weighted mixture of paper and benchmark scores. New submissions should set `metadata.json.track` to `paper` or `benchmark`.

Current release status and remaining organizer tasks are recorded in:

- `benchmarks/nlpcc/RELEASE_STATUS_20260419.md`
- `benchmarks/nlpcc/BASELINE_SOURCES.md`

## What To Give An Agent

Give the AI Scientist agent this file, `AGENT.md`, and the selected track package:

```text
benchmarks/nlpcc/
├── AGENT.md
├── T1/
│   ├── AGENT.md
│   ├── bench.yaml
│   ├── README.md
│   ├── data/data.md
│   ├── references/papers.json
│   └── examples/starter_submission/
├── T2/
└── T3/
```

The recommended agent workflow is tool-first and workspace-first. From the repository root:

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
python scripts/agent_tools.py submission replay .work/T1/submission --track T1
```

Replace `T1` with `T2` or `T3`. For T1 engineering tasks, the prepared workspace also ships a runnable public `FeatureBench-lite` subset:

```bash
python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
```

The lower-level `python scripts/run_release_workflow.py ... --agent-cmd ...` path is still available for human operators or agent adapters, but it is no longer the primary participant-facing workflow.

## Runtime Requirements

Minimum tested baseline:

- Docker Desktop or Docker Engine with Linux containers
- Python 3.11+
- 4 CPU cores
- 16 GB RAM
- 20 GB free disk for T1/T2, 40 GB for T3
- A working LLM API key for the participant's AI Scientist

Recommended for autonomous multi-round runs:

- 8+ CPU cores
- 32 GB RAM
- 60 GB free disk
- Stable network access for model APIs, literature search, and optional data refresh
- At least 45 minutes wall-clock budget per direction/track/round for AI Scientist v2-style agents

GPU is not required for the public package. If the local PyTorch install is broken, agents should prefer CPU-friendly `numpy`/`pandas`/`scikit-learn`/`RDKit`/Lean workflows instead of importing `torch`.

Track-specific environment notes:

- T1 ships runnable `FeatureBench-lite` under the public package.
- T2 organizer Docker uses Lean `4.15.0` and Mathlib `v4.15.0`; first proof checks may be slow.
- T3 should be runnable with CPU-safe cheminformatics/ML tooling; GPU is optional for participant methods.

## Participation Modes

The no-human rule applies only to fully autonomous submissions.

- `fully_autonomous`: after the run starts, humans may not provide research decisions, debugging help, prompt edits, code edits, result selection, or paper-writing help.
- `human_assisted`: human-AI collaboration is allowed, but all human intervention must be disclosed in `metadata.json` and logged in the research trace.

Fully autonomous and human-assisted results should be ranked or reported separately.

## Submission Contract

The agent must produce:

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

For backend replay, include `submission/code/run.py` or `submission/run.py`.

`workspace init` copies the starter submission into `submission/` as a valid editable template. Agents must replace the starter artifacts with real experiments before final submission.

The official score is produced by the AISB backend evaluator, not by an agent's self-reported metrics. Self-reported numbers are useful only when they are traceable through `logs/experiment_log.jsonl` and `paper/claims.json`. Backend replay writes an `official_score` block and leaderboard entries must use that score.

## Public Release Notes

- T1 now ships a runnable public engineering subset under `data/dev/featurebench/`.
- T2 ships a real Lean baseline instead of an empty placeholder.
- The public website leaderboard should be treated as a release-status page until submissions open; live updates will replace placeholders later.

## Validation Notes From 2026-04-13

We ran AI Scientist v2 with GLM 5.1 through OpenRouter on the full `T1/T2/T3 x A/B x 2 rounds` matrix using isolated configs and 3-way parallel execution.

Observed result:

- 11 of 12 launcher processes completed.
- `T1/A/round_2` timed out at a 30 minute wall-clock cap before producing a result node.
- `T2/B/round_1` completed but AI Scientist v2 marked the generated implementation as buggy, so it did not accept it as a best working implementation.
- T3 completed, but RDKit produced invalid-SMILES warnings in some agent-generated experiments. These warnings did not crash the run, but agents should filter invalid molecules before reporting chemical results.
- The previous failure mode where `is_buggy` was returned as the string `"false"` instead of boolean `false` has been fixed in our local AI Scientist v2 integration notes and should be avoided by any adapter.

Operational implications:

- Use `stage-iters=1` only for smoke/integration checks.
- Use `stage-iters>=2` and longer wall time for real autonomous research loops.
- Do not share mutable AI Scientist config files across parallel runs; each run needs an isolated config and output directory.
- Disable global process cleanup in third-party agents during parallel runs, or one run may kill another.
- Skip aggregate plot/VLM stages unless a working VLM path is configured.

## Release Checklist

Before publishing to GitHub, include:

- `benchmarks/nlpcc/T1`, `benchmarks/nlpcc/T2`, `benchmarks/nlpcc/T3`
- `benchmarks/nlpcc/AGENT.md` and this `README.md`
- `aisb.py`, `src/aisb/`, and `scripts/verify_submission.py`
- `tracks/shared/SUBMISSION_STANDARD.md`
- `docs/SECURITY_SPECIFICATION.md`
- `scripts/run_aiscientist_v2_matrix.py` for organizer-side integration validation

Do not publish `.aisb/`, `.aisb_backend/`, local API keys, or cloned third-party AI Scientist repositories.
