# NLPCC AI Scientist v2 Validation Report 2026-04-13

This report records the organizer-side integration run for the public NLPCC reduced package. It is not a leaderboard result and does not contain official hidden-test scores.

## Setup

- Agent system: AI Scientist v2 BFTS launcher
- LLM model: `openrouter/z-ai/glm-5.1`
- Matrix: `T1/T2/T3 x track A/B x 2 rounds`
- Parallelism: 3 launcher processes
- Per-process execution timeout: 1200 seconds
- Per-process wall-clock cap: 1800 seconds
- Stage iterations: 1
- Writeup/review: skipped for integration speed
- GPU: disabled
- PyTorch: not required; CPU-safe guidance enabled

Command:

```bash
python scripts/run_aiscientist_v2_matrix.py --output-dir .aisb/aisv2_matrix_final_rerun --directions T1 T2 T3 --tracks A B --rounds 2 --parallel 3 --timeout-sec 1200 --wall-timeout-sec 1800 --stage-iters 1 --steps 1 --skip-writeup
```

## Process Results

| Direction | Track | Round | Status | Elapsed seconds | Notes |
|---|---:|---:|---:|---:|---|
| T1 | A | 1 | completed | 683.59 | Result node produced and best node selected |
| T1 | A | 2 | timeout | 1801.31 | Timed out before producing a result node |
| T1 | B | 1 | completed | 820.98 | Result node produced and best node selected |
| T1 | B | 2 | completed | 1048.48 | Result node produced and best node selected |
| T2 | A | 1 | completed | 728.18 | Result node produced and best node selected |
| T2 | A | 2 | completed | 723.12 | Result node produced and best node selected |
| T2 | B | 1 | completed | 490.05 | Metrics were produced, but the agent marked the implementation buggy and no best node was accepted |
| T2 | B | 2 | completed | 701.02 | Result node produced and best node selected |
| T3 | A | 1 | completed | 1461.58 | Result node produced and best node selected |
| T3 | A | 2 | completed | 942.90 | Result node produced and best node selected |
| T3 | B | 1 | completed | 710.55 | Result node produced and best node selected; RDKit invalid-SMILES warnings observed |
| T3 | B | 2 | completed | 511.78 | Result node produced and best node selected; RDKit invalid-SMILES warnings observed |

Summary:

- 11 of 12 launcher processes completed.
- 10 of 12 runs completed with a result node and best-node selection.
- 1 run completed but was rejected by the agent as buggy: `T2/B/round_1`.
- 1 run timed out before a result node: `T1/A/round_2`.
- No official backend hidden-test scores were produced by this matrix, because this was an AI Scientist integration run and writeup/submission packaging was skipped.

## Problems Found And Fixes

- AI Scientist v2 sometimes returned `"false"` as a string for `is_bug`. This caused `good_nodes` to reject valid nodes because the code checked `is False`. The local integration now normalizes boolean-like strings.
- Best-node selection fell back to a default OpenAI model when no `select_node` model was configured. The local integration now uses the configured feedback model, and the matrix runner writes `agent.select_node`.
- The third-party AI Scientist v2 checkout is not published in this repository; required adapter-side behavior is documented in `tracks/standard_test/adapters/AI_SCIENTIST_V2_INTEGRATION.md`.
- The local Windows PyTorch installation failed to import. The public agent instructions now explicitly tell agents not to assume PyTorch/GPU availability and to prefer CPU-safe libraries unless verified.
- Shared AI Scientist config files are unsafe for parallel runs. The matrix runner generates one isolated config and output directory per run.
- Third-party global process cleanup is unsafe during parallel runs. The matrix runner disables it through `AI_SCIENTIST_GLOBAL_PROCESS_CLEANUP=0`.
- T3 molecular runs can produce RDKit invalid-SMILES warnings. The T3 instructions now require filtering/logging invalid molecules before making chemical claims.
- A 30 minute wall-clock cap is too tight for some T1/T3 autonomous research loops. The public instructions now recommend at least 45 minutes per direction/track/round for multi-round agents.

## Release Implications

The NLPCC package is suitable to publish as an autonomous-agent evaluation package if the release explicitly separates:

- Agent self-reported experiment metrics
- Submission-format validation
- Backend hidden-test scoring
- CAS/integrity verification

Participants should receive the `benchmarks/nlpcc` package, the `aisb.py` CLI, the submission standard, and the security/integrity documentation. They should not receive local `.aisb/` logs, private evaluator files, API keys, or organizer-only hidden answers.
