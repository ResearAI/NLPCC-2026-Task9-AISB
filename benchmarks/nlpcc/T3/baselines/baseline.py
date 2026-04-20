#!/usr/bin/env python3
"""Frozen CPU-safe T3 baseline.

This baseline produces deterministic out-of-fold predictions on the public dev
labels. It is intentionally simple but honest: each row is predicted from a
fold model that did not see that row's label.
"""
from __future__ import annotations

import argparse
import csv
import json
import statistics
from pathlib import Path


ENDPOINTS = {
    "caco2_wang": {"file": "caco2_wang_dev.csv", "task": "regression"},
    "herg": {"file": "herg_dev.csv", "task": "classification"},
    "ames": {"file": "ames_dev.csv", "task": "classification"},
    "cyp3a4_veith": {"file": "cyp3a4_veith_dev.csv", "task": "classification"},
    "lipophilicity_az": {"file": "lipophilicity_az_dev.csv", "task": "regression"},
}


def default_data_dir() -> Path:
    bench_dir = Path(__file__).resolve().parents[1]
    packaged = bench_dir / "data" / "dev"
    if packaged.exists():
        return packaged
    return Path(__file__).resolve().parents[4] / "data" / "competition" / "T3" / "dev"


def read_rows(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = []
        for row in csv.DictReader(handle):
            first_value = next(iter(row.values()), "")
            if isinstance(first_value, str) and first_value.startswith("#"):
                continue
            try:
                float(row["Y"])
            except (KeyError, TypeError, ValueError):
                continue
            rows.append(row)
        return rows


def fold_prediction(train_values: list[float], task: str) -> float:
    if not train_values:
        return 0.0
    if task == "classification":
        positives = sum(1 for value in train_values if value >= 0.5)
        return 1.0 if positives >= len(train_values) / 2 else 0.0
    return float(statistics.fmean(train_values))


def oof_predictions(rows: list[dict], task: str, folds: int) -> list[dict]:
    values = [float(row["Y"]) for row in rows]
    predictions = []
    for idx, row in enumerate(rows):
        fold = idx % folds
        train_values = [value for j, value in enumerate(values) if j % folds != fold]
        predictions.append(
            {
                "id": row.get("Drug_ID", str(idx)),
                "prediction": fold_prediction(train_values, task),
            }
        )
    return predictions


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="AISB T3 frozen CPU baseline")
    parser.add_argument("--data-dir", default=str(default_data_dir()))
    parser.add_argument("--output-dir", default="submission")
    parser.add_argument("--folds", type=int, default=5)
    args = parser.parse_args(argv)

    data_dir = Path(args.data_dir)
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)
    manifest = {
        "baseline_name": "frozen_cpu_oof_mean_majority",
        "folds": args.folds,
        "endpoints": {},
    }
    for endpoint, cfg in ENDPOINTS.items():
        rows = read_rows(data_dir / cfg["file"])
        preds = oof_predictions(rows, cfg["task"], max(args.folds, 2))
        (out / f"{endpoint}_predictions.json").write_text(
            json.dumps({"predictions": preds}, indent=2),
            encoding="utf-8",
        )
        manifest["endpoints"][endpoint] = {"n": len(rows), "task": cfg["task"], "policy": "out_of_fold_mean_or_majority"}
    (out / "t3_baseline_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
