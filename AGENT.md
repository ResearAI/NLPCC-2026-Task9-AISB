# NLPCC Agent Entry

Use the current NLPCC public package in this repository.

Your task:

1. inspect `benchmarks/nlpcc/T1`, `T2`, and `T3`
2. read the scientific question, `AGENT.md`, `bench.yaml`, `data/data.md`, and paper list for each direction
3. tell the human which direction best fits the goal and why
4. run the chosen benchmark end to end
5. prepare a strict submission with `validate`, `package`, and optional `replay` ready

Start with:

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
```

Then read:

- `benchmarks/nlpcc/AGENT.md`
- `.work/T1/AGENT.md`
- `.work/T1/bench.yaml`
- `.work/T1/data/data.md`
- `.work/T1/references/papers.json`

Before final packaging, report:

- chosen direction and why
- method idea
- current experiment evidence
- current score summary
- whether strict submission validation has passed
