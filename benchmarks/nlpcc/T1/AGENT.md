# Instructions For AI Scientist Agents

You are evaluating and improving a research system on T1: AI/CS reasoning and engineering.

You must execute real experiments. Do not write a paper from speculation alone. Your final paper must be based on a hypothesis, implementation, validation, ablation or negative result analysis, and a final conclusion.

Required output is a submission directory containing:

- `metadata.json`
- `results.json`
- `paper/paper.pdf`
- `paper/source/main.tex`
- `paper/source/refs.bib`
- `paper/source/figures/`
- `paper/claims.json`
- `logs/iterations.jsonl`
- `logs/experiment_log.jsonl`
- `logs/api_calls.jsonl`

Do not attempt to read hidden answer files, canary tokens, evaluator code, or private backend directories. If an experiment fails, log it with `status: "FAILED"` or `status: "ERROR"` and include the error reason.

Use `paper/claims.json` to connect every important numerical claim to an `experiment_id` in `logs/experiment_log.jsonl`.

If your run is `fully_autonomous`, do not ask a human for research decisions, debugging, code edits, result selection, or paper-writing help after the run starts. If your run is `human_assisted`, disclose all human help in `metadata.json.human_contributions` and logs.

Budget guidance: do not assume one 30 minute pass is enough for T1. If a run times out before producing a result node, log it as `TIMEOUT`, checkpoint intermediate artifacts, and continue with a smaller hypothesis or longer budget.

Public local engineering tasks are shipped under `data/dev/featurebench/`. Use:

```bash
python scripts/agent_tools.py t1 run-featurebench --bench-dir <prepared-bench>
```

This writes `featurebench_results.json` from actual pytest outcomes instead of placeholders.
