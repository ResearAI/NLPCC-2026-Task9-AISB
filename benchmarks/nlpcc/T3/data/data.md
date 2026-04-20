# T3 Data Card

Primary sources:

- Packaged public dev data: `data/dev`
- Original local dev source used by organizers: `data/competition/T3/dev`
- Existing local standard-test data: `data/standard_test/T3`
- External refresh script: `scripts/download_competition_data.py --track T3`

Expected prepared layout:

```text
data/
├── dev/
├── test/
└── data.md
```

Packaged public dev endpoints:

- `caco2_wang_dev.csv`
- `herg_dev.csv`
- `ames_dev.csv`
- `cyp3a4_veith_dev.csv`
- `lipophilicity_az_dev.csv`

TDC endpoints include regression and classification tasks. The current public NLPCC evaluator uses MAE for regression endpoints and accuracy for classification endpoints. External TDC leaderboard numbers may use AUROC/AUPRC and are reference context only unless rerun under this evaluator.

Matbench Discovery data is included as a materials-discovery extension where available.
