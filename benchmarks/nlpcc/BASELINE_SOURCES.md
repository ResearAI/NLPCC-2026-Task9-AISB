# NLPCC Baseline And Reference Result Sources

Updated: 2026-04-19

This file separates two result types:

- `local_rerun`: results produced by the AISB/NLPCC local evaluator in this repository.
- `reference_result`: results reported by upstream papers or public leaderboards. These are useful context but are not official NLPCC scores unless rerun under the NLPCC package and evaluator.

## T2 Formal Mathematical Proof

### External Reference Methods

| Method | Source | Reported Result | Reproducibility Note |
|---|---|---:|---|
| DeepSeek-Prover-V1.5-RL + RMaxTS | `deepseek-ai/DeepSeek-Prover-V1.5` | miniF2F-test `63.5%`, ProofNet `25.3%` | Open code and models, but paper reproduction expects Linux, Lean4/Mathlib, 7B model inference, GPU resources, and RMaxTS search. Not a fast default local baseline. |
| ReProver / LeanDojo | `lean-dojo/ReProver` | ReProver miniF2F-test `26.5%`, ProofNet `13.8%` as reported in DeepSeek-Prover-V1.5 comparison table | Open code and small HuggingFace tactic models exist, but running it correctly needs proof-state extraction/search integration. Good research baseline, not the fastest release baseline. |

### Current AISB/NLPCC Baselines

The shipped T2 deterministic baseline is a Lean tactic router. It is intentionally weak but executes real Lean/Mathlib checks:

```bash
python scripts/agent_tools.py workspace init T2 --dest .work/T2
python benchmarks/nlpcc/T2/baselines/baseline.py --max-items 2 --output .work/T2/submission/proofs.json --timeout 25
python benchmarks/nlpcc/T2/evaluation/evaluate.py --submission .work/T2/submission --output .work/T2/t2_scores.json --timeout 60
```

Local smoke result on 2026-04-19:

```json
{
  "checked": 2,
  "proof_rate": 0.0,
  "final_score": 0.0
}
```

This confirms the execution path, not competitive proof-search strength.

The official API-assisted prover path uses Novita's OpenAI-compatible endpoint:

```bash
set NOVITA_API_KEY=<your key>
set NOVITA_PROXY=http://127.0.0.1:7890  # optional, only if your network requires a local proxy
python benchmarks/nlpcc/T2/baselines/baseline.py --provider novita --max-items 2 --output .work/T2/submission/proofs.json --timeout 300 --temperature 1.0 --max-tokens 160000
python benchmarks/nlpcc/T2/evaluation/evaluate.py --submission .work/T2/submission --output .work/T2/t2_scores.json --timeout 120
```

Required setting for reporting:

```json
{
  "provider": "novita",
  "model": "deepseek/deepseek-prover-v2-671b",
  "temperature": 1.0,
  "max_tokens": 160000,
  "verifier": "Lean 4.15.0 + Mathlib v4.15.0"
}
```

Generated proofs are only scored after Lean verification.

Organizer smoke rerun on 2026-04-20:

```json
{
  "provider": "novita",
  "model": "deepseek/deepseek-prover-v2-671b",
  "temperature": 1.0,
  "max_tokens": 8192,
  "samples": 3,
  "checked": 5,
  "proof_rate": 0.0,
  "final_score": 0.0,
  "verifier": "Docker image aisb-t2:latest, Lean 4.15.0, Mathlib v4.15.0",
  "repair_loop": "generate -> Lean verify -> feed diagnostics back to model"
}
```

The API path and Docker verifier both executed successfully. Generated proof candidates were rechecked by the AISB evaluator rather than trusted from self-reported `verified` flags. The five-theorem smoke run did not produce a Lean-verified proof. Failures were dominated by tactic/proof errors and provider remote-close events. The baseline now normalizes generated full-file imports back to the organizer-provided theorem preamble to avoid narrow Mathlib import failures. This is a valid release smoke result, not a competitive proof-search result.

## T3 Scientific Discovery

T3 is aligned with TDC ADMET-style predictive modeling. The current public NLPCC package should show external ADMET references as context while keeping official NLPCC baseline rows separate.

### TDC ADMET Reference Results

TDC ADMET uses scaffold splits and requires repeated runs for leaderboard submissions. Relevant public leaderboard examples:

| Endpoint | Metric | Top Public Reference Result |
|---|---|---:|
| Caco2_Wang | MAE lower is better | CaliciBoost `0.256 ± 0.006` |
| hERG | AUROC higher is better | MapLight + GNN `0.880 ± 0.002` |
| AMES | AUROC higher is better | ZairaChem `0.871 ± 0.002` |
| CYP3A4_Veith | AUPRC higher is better | MapLight + GNN `0.916 ± 0.000` |
| Lipophilicity_AstraZeneca | MAE lower is better | MiniMol `0.456 ± 0.008` |

ADMET-AI is an open-source Chemprop-based ADMET platform. Its paper reports the highest average rank on the TDC ADMET leaderboard and provides a pip-installable local predictor, but ADMET-AI v2 predictions may not exactly match the v1 paper results.

### Current AISB/NLPCC Local Baseline

The current T3 official local baseline is frozen as a CPU-safe 5-fold out-of-fold mean/majority baseline:

```json
{
  "baseline_name": "frozen_cpu_oof_mean_majority",
  "final_score": 0.6385,
  "data": "data/competition/T3/dev",
  "folds": 5
}
```

This row remains separate from TDC public reference results and ADMET-AI.

## Sources

- DeepSeek-Prover-V1.5 GitHub: https://github.com/deepseek-ai/DeepSeek-Prover-V1.5
- ReProver GitHub: https://github.com/lean-dojo/ReProver
- ADMET-AI GitHub: https://github.com/swansonk14/admet_ai
- TDC ADMET overview: https://tdcommons.ai/benchmark/admet_group/overview/
- TDC leaderboard guide: https://tdcommons.ai/benchmark/overview
