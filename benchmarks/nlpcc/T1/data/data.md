# T1 Data Card

Primary sources:

- Existing local dev data: `data/competition/T1/dev`
- Existing local standard-test data: `data/standard_test/T1`
- External refresh script: `scripts/download_competition_data.py --track T1`
- Public runnable engineering subset: `data/competition/T1/dev/featurebench`

Expected prepared layout:

```text
data/
├── dev/
├── test/
└── data.md
```

For participant runs, `data/test/` must not contain answer files. Local preparation moves answer files into `evaluation/private/` for backend use.

The public engineering subset is stored under `data/dev/featurebench/` with:

```text
featurebench/
├── manifest.json
└── tasks/
    └── <task_id>/
        ├── TASK.md
        └── repo/
```

Use `python scripts/agent_tools.py t1 run-featurebench --bench-dir <prepared-bench>` to run the shipped task suite and write `featurebench_results.json`.
