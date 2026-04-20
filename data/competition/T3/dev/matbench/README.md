# Matbench Discovery — Dev Set

## Data

- `wbm_summary_dev.csv`: 1,000 crystals (500 stable + 500 unstable, stratified from 257K WBM dataset)

| Column | Description |
|--------|-------------|
| `# comp` | Chemical composition (e.g., "Ac3U") |
| `nsites` | Number of atoms in unit cell |
| `vol` | Volume (A^3) |
| `e` | Total energy (eV) |
| `e_form` | Formation energy (eV/atom) |
| `e_hull` | Energy above convex hull (eV/atom). **Target variable.** |
| `gap` | Band gap (eV) |

## Task

**Binary classification**: predict whether a crystal is thermodynamically stable.
- Stable: `e_hull <= 0`
- Unstable: `e_hull > 0`

## Full Dataset

Total WBM dataset: 257,489 crystals across 5 substitution steps.
- 48,784 stable (18.9%), 208,711 unstable (81.1%)
- Full structures available in `step_{1-5}.json.bz2` (pymatgen ComputedStructureEntry)

## SOTA

PET-OAM-XL: F1=0.924, CPS=0.898

## Evaluation

```python
import pandas as pd
from sklearn.metrics import f1_score

df = pd.read_csv("wbm_summary_dev.csv")
y_true = (df["e_hull"] <= 0).astype(int)
y_pred = your_model.predict(df)  # 0 or 1
print(f"F1: {f1_score(y_true, y_pred):.3f}")
```

## Reference

Riebesell et al., Nature Machine Intelligence 2025.
GitHub: https://github.com/janosh/matbench-discovery
