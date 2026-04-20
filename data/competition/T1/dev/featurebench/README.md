# AISB FeatureBench-lite

This directory is the public runnable engineering-task subset shipped with the
NLPCC T1 release package.

- Each task is a writable local codebase with failing tests.
- Agents are expected to modify the task repo, run the provided test command,
  and record pass/fail in `featurebench_results.json`.
- This is a local development subset for T1. It is not the full upstream
  FeatureBench release.

Directory layout:

```text
featurebench/
├── manifest.json
└── tasks/
    └── <task_id>/
        ├── TASK.md
        └── repo/
            ├── src/
            └── tests/
```

To run all tasks from a prepared benchmark workspace:

```bash
python scripts/agent_tools.py t1 run-featurebench --bench-dir .aisb/benches/T1
```
