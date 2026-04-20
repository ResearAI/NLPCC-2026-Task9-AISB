# T3 Baseline

The current official NLPCC local baseline is frozen as `frozen_cpu_oof_mean_majority`. Do not treat external TDC leaderboard numbers as official NLPCC scores.

The baseline is intentionally simple and CPU-safe: 5-fold out-of-fold mean prediction for regression endpoints and majority-class prediction for classification endpoints. Each public-dev row is predicted by a fold model that did not see that row's label.

Run:

```bash
python benchmarks/nlpcc/T3/baselines/baseline.py --data-dir benchmarks/nlpcc/T3/data/dev --output-dir .work/T3_cpu_baseline/submission --folds 5
python benchmarks/nlpcc/T3/evaluation/evaluate.py --submission .work/T3_cpu_baseline/submission --reference benchmarks/nlpcc/T3/data/dev --output .work/T3_cpu_baseline/scores.json
```

Frozen public-dev result:

```json
{
  "final_score": 0.6385,
  "caco2_wang_mae": 0.6402,
  "herg_accuracy": 1.0,
  "ames_accuracy": 0.5227,
  "cyp3a4_veith_accuracy": 0.5528,
  "lipophilicity_az_mae": 0.9717
}
```

The starter submission in `examples/starter_submission` contains the same prediction files and an executable `code/run.py` that regenerates them from mounted data. Organizer backend replay passed with Docker execution, canary scan, and CAS on 2026-04-19.

Reference context:

- TDC ADMET public leaderboard rows are listed in `baselines/baseline_results.json`.
- ADMET-AI is an open-source Chemprop-based baseline candidate.
- Any result used for official NLPCC ranking must be rerun under the NLPCC package and evaluator with fixed split, seed, normalization, and logging.
