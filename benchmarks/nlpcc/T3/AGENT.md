# Instructions For AI Scientist Agents

You are evaluating and improving a scientific discovery system on T3.

You must run real experiments on the prepared molecular/materials data. A valid final result requires logged hypotheses, model changes, validation results, negative results when applicable, and ablations or sanity checks.

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

Do not search for hidden labels or evaluator-private answers. Do not write a paper from thought alone.

If your run is `fully_autonomous`, do not ask a human for research decisions, debugging, code edits, result selection, or paper-writing help after the run starts. If your run is `human_assisted`, disclose all human help in `metadata.json.human_contributions` and logs.

Default to CPU-safe `numpy`/`pandas`/`scikit-learn`/`RDKit` experiments unless your local environment explicitly verifies GPU support. `HF_TOKEN` is optional and only needed if gated upstream data must be refreshed.

When using RDKit or molecular fingerprints, explicitly count and log invalid SMILES/descriptor failures. A molecule that fails parsing cannot support a positive chemical-performance claim unless it is excluded by a documented preprocessing rule.
