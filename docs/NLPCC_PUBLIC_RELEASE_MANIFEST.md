# NLPCC Public Release Manifest

Updated: 2026-04-20

This document defines what should go into the public NLPCC GitHub release repository and what must stay out.

Public repository target:

- `https://github.com/ResearAI/NLPCC-2026-Task9-AISB`

The current public release is the **NLPCC package inside AISB**, not the entire local development repository.

## 1. Must Publish

These are the files and directories that should exist in the public release repo.

### 1.1 Human-facing entry

- `README.md`
- `docs/CALL_FOR_PARTICIPATION.md`
- `tracks/shared/SUBMISSION_STANDARD.md`
- `docs/SECURITY_SPECIFICATION.md`
- `website/`

These explain:

- what the competition is
- what T1/T2/T3 are
- how humans hand the package to their AI Scientist
- how strict submission works
- how integrity and replay work

### 1.2 Agent-facing benchmark package

- `benchmarks/nlpcc/README.md`
- `benchmarks/nlpcc/AGENT.md`
- `benchmarks/nlpcc/BASELINE_SOURCES.md`
- `benchmarks/nlpcc/RELEASE_STATUS_20260419.md`
- `benchmarks/nlpcc/T1/`
- `benchmarks/nlpcc/T2/`
- `benchmarks/nlpcc/T3/`

Each track package should include:

- `AGENT.md`
- `README.md`
- `bench.yaml`
- `LICENSES.md`
- `data/data.md`
- `references/papers.json`
- `evaluation/`
- `docker/`
- `baselines/`
- `examples/starter_submission/`

### 1.3 Public runner and validation tools

- `scripts/agent_tools.py`
- `scripts/verify_submission.py`
- `src/aisb/`
- `aisb.py` if used as the public CLI entrypoint

These are required for:

- `workspace init`
- `evaluate`
- `submission validate`
- `submission package`
- `submission replay`

### 1.4 Public benchmark data only

Only **public/dev** data that participants are allowed to see should be published.

Examples that belong in the public repo:

- T1 public engineering subset such as `FeatureBench-lite`
- T2 public theorem/dev set and public Lean verification resources
- T3 public dev split and any public benchmark metadata needed by the evaluator

Rule:

- if the participant agent is allowed to read it during local runs, it may be public
- if the organizer backend relies on it but the participant is not supposed to see it, it must not be public

## 2. Can Publish If Clean

These are optional but useful public artifacts.

- baseline result cards
- baseline notes and reproduction notes
- public validation reports
- public release notes
- starter submission templates
- environment setup notes
- FAQ / troubleshooting docs

These are useful if they do not expose hidden data, local secrets, or organizer-only paths.

## 3. Must Not Publish

These must stay out of the public repo.

### 3.1 Hidden evaluation assets

- hidden test answers
- canary manifests
- hidden-score lookup tables
- private evaluator config
- organizer-only standard test labels
- any file whose only purpose is final closed-book scoring

### 3.2 Local machine and secret material

- `.env`
- API keys
- HuggingFace tokens
- browser cookies
- local paths
- `.work/`
- `.aisb/`
- `.aisb_backend/`
- `Openrouter_api_key.txt`

### 3.3 Local experiments and scratch outputs

- `results/`
- `submission/`
- `experiments/`
- `experiment.zip`
- `experiment_extracted/`
- temporary devset outputs
- notebook scratch artifacts
- downloaded paper caches if not intended for public redistribution

### 3.4 Third-party cloned repos and unrelated systems

- `AIST/`
- `AISB_UP/`
- `AISB_explore/`
- any cloned AI Scientist repo
- unrelated `src/deepscientist/`, `src/ui/`, `src/tui/` trees unless they are intentionally part of the public NLPCC release

If a subsystem is not required for participant evaluation or public documentation, it should not go into the public NLPCC repo.

## 4. Public Data Policy

For NLPCC release, publish:

- data cards
- public dev splits
- public metadata
- starter examples
- evaluator-visible schemas

Do not publish:

- hidden answers
- hidden test labels
- private benchmark internals used only for final organizer scoring

If a dataset is large or license-sensitive:

- publish the schema and data card
- publish a download script or source link
- do not mirror the raw data in Git unless the license and size both allow it

## 5. Minimum Public Repo Structure

```text
NLPCC-2026-Task9-AISB/
├── README.md
├── docs/
│   ├── CALL_FOR_PARTICIPATION.md
│   └── SECURITY_SPECIFICATION.md
├── benchmarks/
│   └── nlpcc/
│       ├── README.md
│       ├── AGENT.md
│       ├── T1/
│       ├── T2/
│       └── T3/
├── tracks/
│   └── shared/
│       └── SUBMISSION_STANDARD.md
├── scripts/
│   ├── agent_tools.py
│   └── verify_submission.py
├── src/
│   └── aisb/
└── website/
```

## 6. Release Gate Before Push

Before pushing to the public repo, verify all of the following:

1. `npm run build` in `website/` passes.
2. `python -m pytest tests/e2e/test_submission_standard.py` passes.
3. T1/T2/T3 starter submissions all pass `validate`.
4. T1/T2/T3 starter submissions all pass `replay`.
5. No hidden answers or canary files are inside the Git index.
6. No local secrets or `.work/` files are staged.
7. Public links point to `ResearAI/NLPCC-2026-Task9-AISB`.

## 7. Recommended Push Strategy

Do **not** push the entire current local repository as-is.

Recommended approach:

1. create a clean release worktree or clean export directory
2. copy only the public NLPCC release subset
3. run validation again inside that clean tree
4. push that clean tree to `ResearAI/NLPCC-2026-Task9-AISB`

This is safer than trying to publish from a dirty development tree that contains local experiments and unrelated subsystems.
