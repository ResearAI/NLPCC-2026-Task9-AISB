# T2 Data Card

Primary sources:

- Existing local dev data: `data/competition/T2/dev/formalmath_dev.json`
- Existing local standard-test data: `data/standard_test/T2/formalmath_500.json`
- External refresh script: `scripts/download_competition_data.py --track T2`

Expected prepared layout:

```text
data/
├── dev/
├── test/
└── data.md
```

Each problem should have a unique id, a Lean statement, and any non-hidden metadata required for proof search. Hidden reference proofs must not be mounted into the agent-visible directory.
