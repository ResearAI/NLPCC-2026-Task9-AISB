# T3 Scientific Discovery

T3 tests whether an AI Scientist can improve scientific-discovery models with real experiments. The current NLPCC reduction focuses on TDC ADMET-style molecular property prediction and Matbench Discovery-style materials data.

Use:

```bash
python scripts/agent_tools.py workspace init T3 --dest .work/T3
python scripts/agent_tools.py evaluate T3 --bench-dir .work/T3 --submission .work/T3/submission
python scripts/agent_tools.py submission validate .work/T3/submission
python scripts/agent_tools.py submission package .work/T3/submission
```

The lower-level `run_release_workflow.py --agent-cmd ...` path is reserved for organizer adapters, not the primary participant-facing workflow.

The final paper must report results that are traceable to logs and artifacts through `paper/claims.json`.

If you expect organizer-side Docker replay, include `submission/code/run.py` or `submission/run.py`.

Runtime note from validation: RDKit may emit invalid-SMILES or valence warnings when an agent generates synthetic or transformed molecules. These warnings do not automatically invalidate a run, but the agent must filter invalid molecules and must not report chemical conclusions from failed parses.

The official public local baseline is `frozen_cpu_oof_mean_majority`, reported in `baselines/baseline_results.json`. External TDC ADMET leaderboard results and ADMET-AI are listed as reference context in `references/papers.json` and `../BASELINE_SOURCES.md`; they are not official NLPCC scores until rerun under the NLPCC evaluator.

Current public-dev baseline result:

```json
{
  "final_score": 0.6385,
  "endpoints": {
    "caco2_wang": {"metric": "mae", "score": 0.6402, "normalized": 0.6097, "n": 91},
    "herg": {"metric": "accuracy", "score": 1.0, "normalized": 1.0, "n": 65},
    "ames": {"metric": "accuracy", "score": 0.5227, "normalized": 0.5227, "n": 727},
    "cyp3a4_veith": {"metric": "accuracy", "score": 0.5528, "normalized": 0.5528, "n": 1232},
    "lipophilicity_az": {"metric": "mae", "score": 0.9717, "normalized": 0.5072, "n": 420}
  }
}
```

The starter submission is executable. It regenerates the frozen CPU baseline predictions from mounted data, passes strict submission validation, and passes organizer-style backend replay with Docker execution, canary scan, and CAS.
