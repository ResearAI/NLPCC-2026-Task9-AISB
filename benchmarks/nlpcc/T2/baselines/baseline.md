# T2 Baselines

The public T2 release includes two real Lean-verified baseline paths.

## Deterministic Lean Router

The deterministic baseline:

- it reads released FormalMATH theorem files
- routes each theorem to a small deterministic tactic shortlist
- checks each candidate with real Lean execution
- writes `proofs.json` instead of an empty placeholder

This baseline is still weak, but it is a real proof-search baseline rather than
an empty smoke-test artifact.

Run:

```bash
python benchmarks/nlpcc/T2/baselines/baseline.py --provider deterministic --max-items 2 --output .work/T2/submission/proofs.json --timeout 60
```

## Novita DeepSeek-Prover-V2 Baseline

The stronger API-assisted baseline uses Novita's OpenAI-compatible endpoint with:

- `model`: `deepseek/deepseek-prover-v2-671b`
- `temperature`: `1.0`
- `max_tokens`: `160000`
- verifier: local Lean `4.15.0` + Mathlib `v4.15.0`

Set the API key outside the repository:

```bash
set NOVITA_API_KEY=<your key>
set NOVITA_PROXY=http://127.0.0.1:7890  # optional; use only if your network requires a proxy
```

Run:

```bash
python benchmarks/nlpcc/T2/baselines/baseline.py --provider novita --max-items 2 --output .work/T2/submission/proofs.json --timeout 300 --temperature 1.0 --max-tokens 160000
python benchmarks/nlpcc/T2/evaluation/evaluate.py --submission .work/T2/submission --output .work/T2/t2_scores.json --timeout 120
```

This row must be reported with its provider, model, temperature, budget, Lean version, Mathlib version, and date. It is a real T2 baseline because generated proofs are scored only after Lean verification, but it is not as reproducible as the deterministic router because hosted model behavior and availability can change.
