# AISB 2026 / NLPCC Submission Standard

Updated: 2026-04-19

This is the official public submission contract used by the local `aisb` CLI, `scripts/verify_submission.py`, `scripts/agent_tools.py`, and the backend evaluator.

## Required Layout

```text
submission/
├── metadata.json
├── results.json
├── code/                      # optional but recommended for backend replay
│   └── run.py                 # or root-level run.py as legacy-compatible entrypoint
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

Do not place API keys, HuggingFace tokens, hidden answers, canary tokens, or private evaluator files in the submission package.

## Required `metadata.json`

```json
{
  "team_name": "string",
  "system_name": "string",
  "track": "benchmark",
  "direction": "T1",
  "autonomy_level": "fully_autonomous",
  "contact_email": "team@example.com",
  "human_contributions": "required only if autonomy_level is human_assisted",
  "team_members": ["optional"],
  "base_models": ["optional"],
  "total_cost_usd": 0.0,
  "total_runtime_hours": 0.0
}
```

Allowed values:

- `track`: `paper` or `benchmark`. Legacy `A`/`B` values are accepted by the validator for older starter packages, but new submissions should use `paper` or `benchmark`.
- `direction`: `T1`, `T2`, or `T3`
- `autonomy_level`: `fully_autonomous` or `human_assisted`

Autonomy policy:

- `fully_autonomous`: after the run starts, humans may not provide research decisions, debugging help, prompt edits, code edits, result selection, or paper-writing help. Operational setup before the run is allowed, but must not include task-specific solution content.
- `human_assisted`: human-AI collaboration is allowed, but every human intervention must be disclosed in `human_contributions` and reflected in the logs where applicable.
- Fully autonomous and human-assisted submissions should be ranked or reported separately.

## Required `results.json`

`results.json` is the machine-readable benchmark result summary. It must include `final_score` and should include per-task metrics.

Example:

```json
{
  "direction": "T3",
  "final_score": 0.42,
  "metrics": {
    "tdc_average": 0.42
  }
}
```

## Required Paper Files

- `paper/paper.pdf`: human-reviewable final paper.
- `paper/source/main.tex`: LaTeX source for reproducibility.
- `paper/source/refs.bib`: bibliography.
- `paper/source/figures/`: figures used by the paper. Use normal paper figure formats such as `.pdf`, `.png`, `.jpg`, or `.jpeg`.
- `paper/claims.json`: structured claim list used by CAS.

## Required `paper/claims.json`

Each important numerical claim in the paper must link to an executed experiment.

```json
{
  "claims": [
    {
      "claim_id": "c1",
      "experiment_id": "exp_001",
      "metric_name": "final_score",
      "value": 0.42,
      "direction": "T3",
      "description": "Final T3 normalized score"
    }
  ]
}
```

## Required Logs

`logs/iterations.jsonl` records the research loop:

```json
{"iteration":1,"timestamp":"2026-04-12T00:00:00Z","status":"SUCCESS","hypothesis":"Molecular fingerprints improve hERG prediction.","action":"Train RF on Morgan fingerprints.","code_hash":"git:abc123","metrics_after":{"final_score":0.42}}
```

`logs/experiment_log.jsonl` is the CAS source of truth:

```json
{"experiment_id":"exp_001","timestamp":"2026-04-12T00:00:00Z","status":"SUCCESS","code_hash":"git:abc123","metrics":{"final_score":0.42}}
```

Failed experiments must also be logged:

```json
{"experiment_id":"exp_002","timestamp":"2026-04-12T00:30:00Z","status":"FAILED","code_hash":"git:def456","error":"Lean timeout","metrics":{}}
```

`logs/api_calls.jsonl` records model/API calls or a no-op record if no external model/API was used.

## Optional Backend Replay Entrypoint

If you want organizer-side backend execution with `--execute-submission`, include one of:

- `code/run.py` (preferred)
- `run.py` (legacy-compatible)

The replay entrypoint should reproduce the submission workflow inside the AISB container and write any new runtime artifacts only under the mounted submission directory.

## Local Validation And Packaging

From the repository root:

```bash
python aisb.py submit validate submission/
python aisb.py submit package submission/
```

After package installation, the same commands are:

```bash
aisb submit validate submission/
aisb submit package submission/
```

The agent-facing tool wrappers are:

```bash
python scripts/agent_tools.py submission validate submission/
python scripts/agent_tools.py submission package submission/
python scripts/agent_tools.py submission replay submission/ --track T1
```

## Disqualification Conditions

- Hidden answer or canary leakage.
- `paper/claims.json` values not supported by `logs/experiment_log.jsonl` resulting in CAS below threshold.
- Missing required submission files.
- Direct access to hidden answers, private evaluator files, or canary manifests.
- Fabricated successful experiments or unreported manual human intervention.
