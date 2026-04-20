# T2 Formal Mathematical Proof

T2 tests whether an AI Scientist can perform formal mathematical research iterations using Lean4.

The agent should propose proof-search hypotheses, run Lean checks, log failed and successful proof attempts, and write a paper whose claims are backed by `experiment_log.jsonl`.

Recommended local workflow:

```bash
python scripts/agent_tools.py workspace init T2 --dest .work/T2
python scripts/agent_tools.py evaluate T2 --bench-dir .work/T2 --submission .work/T2/submission
python scripts/agent_tools.py submission validate .work/T2/submission
python scripts/agent_tools.py submission package .work/T2/submission
```

The official Docker target is `aisb-t2:latest` from `tracks/shared/docker/Dockerfile.t2`. It pins Lean `4.15.0` and Mathlib `v4.15.0`; first checks can be slow because Mathlib must be available inside the container.

T2 benchmark submissions must include `proofs.json` at the submission root. Each item must use an official theorem id and either:

- `proof`: a proof body to be inserted under the organizer-provided theorem statement
- `lean_code`: a full Lean file that still contains the exact organizer-provided theorem statement

The evaluator ignores any submitted `verified` flag, binds the proof to the official theorem id/statement, rejects `sorry`/`admit`/`axiom`, and reruns Lean. Missing theorem ids count as failed proofs.

The public baseline in `baselines/baseline.py` supports:

- `--provider deterministic`: fully local tactic router, weak but stable.
- `--provider novita`: DeepSeek-Prover-V2 through Novita's OpenAI-compatible API, with `temperature=1.0`, `max_tokens=160000`, and local Lean verification.

For the Novita path, set `NOVITA_API_KEY` outside the repository. If your network requires a proxy, set `NOVITA_PROXY`, `HTTPS_PROXY`, or `HTTP_PROXY`; the baseline will route API calls through that proxy. Do not write API keys into code, logs, or submissions.

External references such as DeepSeek-Prover-V1.5 and ReProver are listed in `references/papers.json` and `../BASELINE_SOURCES.md`. They are useful reproducibility targets, but their reported upstream scores are not official NLPCC scores unless rerun under the NLPCC package and evaluator.
