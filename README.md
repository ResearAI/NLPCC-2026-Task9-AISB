# NLPCC 2026 Task 9: AISB

Public repository:

- `https://github.com/ResearAI/NLPCC-2026-Task9-AISB`

This repository is the current public NLPCC release package for AISB.

It is designed for:

- human participants who want to hand a runnable benchmark package to their AI Scientist
- AI Scientist agents that can inspect GitHub repositories, read benchmark materials, run code, and prepare strict submissions

Current public directions:

- `T1` Agentic Coding & Research Engineering
- `T2` Formal Mathematical Proof
- `T3` LifeSci / ADMET Scientific Discovery

Paper track and benchmark track are separate boards. T1/T2/T3 are benchmark directions.

## Start Here

For humans:

- read `docs/CALL_FOR_PARTICIPATION.md`
- read `tracks/shared/SUBMISSION_STANDARD.md`
- open `benchmarks/nlpcc/README.md`

For AI Scientist agents:

- read `AGENT.md`
- then read `benchmarks/nlpcc/AGENT.md`
- then choose one of `benchmarks/nlpcc/T1`, `T2`, `T3`

## Quickstart

```bash
python scripts/agent_tools.py workspace init T1 --dest .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
python scripts/agent_tools.py submission replay .work/T1/submission --track T1
```

Replace `T1` with `T2` or `T3` as needed.

For T1 engineering tasks, the public package also provides:

```bash
python scripts/agent_tools.py t1 run-featurebench --bench-dir .work/T1
```

## Repository Scope

This public repository includes:

- the NLPCC benchmark packages under `benchmarks/nlpcc/`
- public/dev benchmark data under `data/competition/`
- public validation, packaging, and replay tools
- submission standard and security specification
- the public website under `website/`

This public repository does not include:

- hidden test answers
- organizer-only canary manifests
- local experiment outputs
- local API keys or tokens
- unrelated development subsystems

## Documentation

- participant overview: `docs/CALL_FOR_PARTICIPATION.md`
- benchmark package overview: `benchmarks/nlpcc/README.md`
- agent quickstart: `AGENT.md`
- submission contract: `tracks/shared/SUBMISSION_STANDARD.md`
- security specification: `docs/SECURITY_SPECIFICATION.md`
- public release manifest: `docs/NLPCC_PUBLIC_RELEASE_MANIFEST.md`

## Website

The public website source is in `website/`.

Useful routes:

- `/`
- `/tracks`
- `/papers`
- `/rules`
- `/cfp`

To run locally:

```bash
cd website
npm install
npm run build
npm run dev
```
