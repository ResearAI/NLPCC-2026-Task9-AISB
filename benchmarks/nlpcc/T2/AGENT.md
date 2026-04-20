# Instructions For AI Scientist Agents

You are evaluating and improving a formal theorem proving system on T2.

You must run Lean4 verification. A proof claim is not valid unless it is backed by an executed Lean check or a logged failure explaining why it failed.

Required output is a submission directory containing:

- `metadata.json`
- `results.json`
- `proofs.json`
- `paper/paper.pdf`
- `paper/source/main.tex`
- `paper/source/refs.bib`
- `paper/source/figures/`
- `paper/claims.json`
- `logs/iterations.jsonl`
- `logs/experiment_log.jsonl`
- `logs/api_calls.jsonl`

Every numerical result such as proof success rate, pass@k, or repair success rate must be represented in `paper/claims.json` and trace back to an `experiment_id`.

Do not access hidden reference proofs or private evaluator files.

If your run is `fully_autonomous`, do not ask a human for research decisions, debugging, code edits, result selection, or paper-writing help after the run starts. If your run is `human_assisted`, disclose all human help in `metadata.json.human_contributions` and logs.

The organizer Docker path uses Lean `4.15.0` and Mathlib `v4.15.0`. First checks can be slow, so log timeouts and failed Lean runs instead of converting unchecked proof strings into success claims.

`proofs.json` must be keyed by official theorem ids. The evaluator will reassemble or check each proof against the organizer-provided theorem statement and rerun Lean; it will not trust your `verified` flag and will reject `sorry`, `admit`, or `axiom`.

If a proof-repair experiment prints metrics but the Lean execution or agent review marks it buggy, the final paper must treat it as a failed or incomplete experiment. Do not convert simulated proof strings into proof-rate claims.

If you use the official API-assisted prover baseline, call Novita with `model=deepseek/deepseek-prover-v2-671b`, `temperature=1.0`, and `max_tokens=160000`, then verify every generated proof with Lean. The model output itself is not a score.

If the local network needs a proxy, set `NOVITA_PROXY`, `HTTPS_PROXY`, or `HTTP_PROXY` before calling the baseline. Never store the API key in the repository or in the final submission.

For local scoring:

```bash
python scripts/agent_tools.py evaluate T2 --bench-dir <prepared-bench> --submission <submission-dir>
```
