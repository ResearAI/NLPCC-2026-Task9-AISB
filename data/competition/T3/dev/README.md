# T3 Leaderboard Track — Dev Set (TDC ADMET)

## Files
Each `.tab` file is a TSV with columns: `Drug_ID`, `Drug` (SMILES string), `Y` (target value).

| File | Endpoint | Task | Samples | Metric |
|------|----------|------|---------|--------|
| `caco2_wang_dev.tab` | Caco-2 Permeability | Regression | 91 | MAE |
| `herg_dev.tab` | hERG Inhibition | Classification | 65 | AUC-ROC |
| `hia_hou_dev.tab` | Human Intestinal Absorption | Classification | 57 | AUC-ROC |
| `lipophilicity_astrazeneca_dev.tab` | Lipophilicity | Regression | 420 | MAE |
| `pgp_broccatelli_dev.tab` | P-glycoprotein Inhibition | Classification | 121 | AUC-ROC |
| `bioavailability_ma_dev.tab` | Bioavailability | Classification | 64 | AUC-ROC |

## Data Format
```
Drug_ID	Drug	Y
"(-)-epicatechin"	"Oc1cc(O)c2c(c1)OC(c1ccc(O)c(O)c1)C(O)C2"	-6.2199998
```

## Local Evaluation
```python
import pandas as pd
from sklearn.metrics import mean_absolute_error, roc_auc_score

# Regression endpoint (Caco-2)
df = pd.read_csv("caco2_wang_dev.tab", sep="\t")
predictions = your_model.predict(df["Drug"])
mae = mean_absolute_error(df["Y"], predictions)

# Classification endpoint (hERG)
df = pd.read_csv("herg_dev.tab", sep="\t")
pred_proba = your_model.predict_proba(df["Drug"])
auc = roc_auc_score(df["Y"], pred_proba)
```

## Scoring
Final T3 score = average normalized score across all endpoints.
- Regression: `1 - (MAE / baseline_MAE)` (capped at [0, 1])
- Classification: `AUC-ROC` directly

## Notes
- Dev set is 10% of full training data
- Full test set uses held-out compounds not in training data
- SMILES strings can be processed with RDKit (`from rdkit import Chem`)
