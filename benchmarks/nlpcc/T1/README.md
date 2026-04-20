# T1 AI/CS Reasoning & Engineering

T1 is the NLPCC/AISB reduced track for testing whether an AI Scientist can improve AI/CS reasoning and agentic coding performance through real experiments.

The release package uses HLE-style expert reasoning questions and a runnable public FeatureBench-lite engineering subset. The agent must run experiments, log failed and successful trials, write a paper from the evidence, and submit structured claims for CAS verification.

Recommended local workflow:

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
```

The benchmark package does not expose hidden test answers to the agent-visible `data/test/` directory. `python scripts/agent_tools.py workspace init T1 --dest .work/T1` prepares the agent workspace while preserving the data-safety boundary.

The public engineering subset lives under `data/dev/featurebench/` after workspace preparation. Each task is a local repo with failing tests. Agents should edit the repo, run its test command, and export a `featurebench_results.json` entry for each task.
