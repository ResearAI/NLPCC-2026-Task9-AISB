# NLPCC Release Status And Execution Plan

Updated: 2026-04-20

This file records the current organizer-facing status for the NLPCC public AISB release. Read this file first after context compression, then read `benchmarks/nlpcc/README.md`, `benchmarks/nlpcc/AGENT.md`, `benchmarks/nlpcc/BASELINE_SOURCES.md`, and `tracks/shared/SUBMISSION_STANDARD.md`.

## Scope

NLPCC is the current public competition package built from AISB. AISB remains the broader benchmark platform and research program. NLPCC exposes a reduced, runnable set of directions and tools for participants and their agents.

The NLPCC release contains:

- `T1`: AI/CS reasoning and engineering, including runnable `FeatureBench-lite`.
- `T2`: formal mathematical proof with Lean 4 / Mathlib execution.
- `T3`: scientific discovery with ADMET/materials-style predictive modeling.
- `Paper leaderboard`: paper quality, research insight, claim traceability, and CAS integrity.
- `Benchmark leaderboard`: executable benchmark score, reproducibility, and CAS integrity.

T1/T2/T3 are benchmark directions. Paper and benchmark leaderboards are reported separately rather than combined by a fixed weighted formula. New submissions should set `metadata.json.track` to `paper` or `benchmark`; legacy `A`/`B` is still accepted for older packages.

## Participation Modes

The no-human rule applies only to the fully autonomous track.

- `fully_autonomous`: after the run starts, humans may not provide research decisions, debugging help, prompt edits, code edits, result selection, or paper-writing help. The agent may use allowed tools, model APIs, search, code execution, and local evaluators.
- `human_assisted`: human-AI collaboration is allowed, but all human intervention must be disclosed in `metadata.json` and logged in the research trace. These submissions must be ranked or reported separately from fully autonomous submissions.

Both modes must run real experiments. A paper is invalid if its numerical claims do not trace to `logs/experiment_log.jsonl` and `paper/claims.json`.

## Current Local Results

These are release-readiness results, not final official leaderboard claims.

| Direction | Current Status | Result |
|---|---|---|
| T1 | Runnable public package exists | Public baseline final score `0.4000`: HLE accuracy `0.0000`, FeatureBench-lite pass rate `1.0000`. |
| T2 | Real Lean/Mathlib execution path works; Novita DeepSeek-Prover-V2 API-assisted prover path is available | Backend official scoring now binds submitted proofs to official theorem ids/statements and reruns Lean. Starter replay checks all 50 public-dev theorems and scores `0.0000`; Novita repair-loop smoke rerun remains `0/5` verified with `temperature=1.0`, `max_tokens=8192`, `samples=3`; full reporting setting remains `max_tokens=160000` when provider connection permits. |
| T3 | Public package, evaluator, starter submission, and backend replay are runnable | Frozen 5-fold out-of-fold mean/majority baseline self-report is `0.6385`; backend official replay recomputes `0.6174` on the packaged public-dev endpoints. Starter submission passes strict validation, Docker execution, canary scan, CAS, and official scoring with backend verdict `PASS`. |

## External Reference Results

External results are displayed as context and potential reproducibility targets, not as AISB/NLPCC official scores.

- `DeepSeek-Prover-V1.5-RL + RMaxTS`: miniF2F-test `63.5%`, ProofNet `25.3%`.
- `ReProver / LeanDojo`: miniF2F-test `26.5%`, ProofNet `13.8%` as reported in the DeepSeek-Prover-V1.5 comparison table.
- `TDC ADMET public leaders`: Caco2 MAE `0.256`, hERG AUROC `0.880`, AMES AUROC `0.871`, CYP3A4 AUPRC `0.916`, Lipophilicity MAE `0.456`.
- `ADMET-AI`: open-source Chemprop-based ADMET platform; useful baseline candidate, not yet rerun as an official NLPCC row.

Detailed source notes are in `benchmarks/nlpcc/BASELINE_SOURCES.md`.

## Participant-Agent Environment

Minimum local environment:

- Docker Desktop or Docker Engine with Linux containers.
- Python `3.11+`.
- 4 CPU cores.
- 16 GB RAM.
- 20 GB free disk for T1/T2, 40 GB free disk for T3.

Recommended for multi-round autonomous agents:

- 8+ CPU cores.
- 32 GB RAM.
- 60 GB free disk.
- Stable internet for literature/code search and model APIs.
- At least 45 minutes wall-clock per direction/track/round.

Track-specific notes:

- T1 includes `FeatureBench-lite` and can be run through `python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1`.
- T2 requires real Lean checks. The organizer Docker image uses Lean `4.15.0` and Mathlib `v4.15.0`; first proof checks can be slow.
- T3 should default to CPU-safe `numpy`/`pandas`/`scikit-learn`/`RDKit` style experiments. GPU is optional, not required for the public kit.

Secrets:

- Participants provide their own model/API keys.
- `HF_TOKEN` is only needed if gated upstream data must be refreshed.
- No secret may be written into the submission package.

## Tool-First Workflow

Participant agents should not treat `run_release_workflow.py --agent-cmd` as the primary interface. That path is for human operators or adapter scripts.

Use the public tool-first flow:

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
python scripts/agent_tools.py submission replay .work/T1/submission --track T1
```

Replace `T1` with `T2` or `T3`.

`workspace init` now seeds `.work/<track>/submission/` with a valid starter submission template, so validation/package commands run immediately. Agents must still replace starter outputs with real experiment artifacts before final submission.

Backend replay now writes an `official_score` block from the track evaluator after container execution and integrity checks. Leaderboards must use that official score instead of trusting `results.json`.

## Website Plan

The website should present AISB as a platform that can host multiple competitions.

- AISB homepage: show AISB-level totals and pin the current competition.
- Current competition: `NLPCC 2026 AISB Shared Task`.
- Upcoming competition: `CCL`.
- Leaderboard: ready-state page now; later live-update table with filters for competition, direction, track, autonomy mode, result type, benchmark, and experiment setting.
- Paper exploration: reserve a surface for papers, benchmark papers, and participant-generated research reports.
- NLPCC page: show NLPCC directions, two participation tracks, papers/references, benchmark package, environment, and CFP.

## Release Gaps

The package is close to participant-agent usable, but the following items remain important before treating the release as final:

- Continue improving the T2 Novita/ReProver-style proof-search baseline. The current organizer Novita smoke row is real and verified by Lean, but remains `0.0000` on five public theorems.
- Decide later whether T2 also needs a local ReProver-style baseline. This is no longer blocking the NLPCC public package.
- Unify public direction names across website, `bench.yaml`, README files, and release docs. The stable mapping should be richer than plain Code/Math/Bio while still mapping to Agentic Coding, Formal Math, and LifeSci/ADMET.
- Keep the online submission portal out of scope for the current release unless explicitly scheduled.
- Keep public leaderboard rows clearly separated into official local reruns, external references, and participant live submissions.
