#!/usr/bin/env python3
"""Evaluate T3 endpoint predictions."""
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from metrics import accuracy, mae, normalized_regression_score


ENDPOINTS = {
    "caco2_wang": {"metric": "mae", "task_type": "regression"},
    "herg": {"metric": "accuracy", "task_type": "classification"},
    "ames": {"metric": "accuracy", "task_type": "classification"},
    "cyp3a4_veith": {"metric": "accuracy", "task_type": "classification"},
    "lipophilicity_az": {"metric": "mae", "task_type": "regression"},
}


def read_labels(path: Path) -> list[float]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        values = []
        for row in reader:
            first_value = next(iter(row.values()), "")
            if isinstance(first_value, str) and first_value.startswith("#"):
                continue
            try:
                values.append(float(row["Y"]))
            except (KeyError, TypeError, ValueError):
                continue
        return values


def read_predictions(path: Path) -> list[float]:
    data = json.loads(path.read_text(encoding="utf-8"))
    values = data.get("predictions", data) if isinstance(data, dict) else data
    return [float(item.get("prediction", item)) if isinstance(item, dict) else float(item) for item in values]


def label_path(reference: Path, endpoint: str) -> Path:
    test_path = reference / f"{endpoint}_test.csv"
    if test_path.exists():
        return test_path
    return reference / f"{endpoint}_dev.csv"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--submission", required=True)
    parser.add_argument("--reference", required=True)
    parser.add_argument("--output", default="scores.json")
    args = parser.parse_args()

    submission = Path(args.submission)
    reference = Path(args.reference)
    endpoint_scores = {}
    normalized = []

    for name, cfg in ENDPOINTS.items():
        labels_path = label_path(reference, name)
        pred_path = submission / f"{name}_predictions.json"
        if not labels_path.exists() or not pred_path.exists():
            endpoint_scores[name] = {"error": "missing labels or predictions", "score": 0.0}
            normalized.append(0.0)
            continue
        y_true = read_labels(labels_path)
        y_pred = read_predictions(pred_path)
        n = min(len(y_true), len(y_pred))
        y_true = y_true[:n]
        y_pred = y_pred[:n]
        if cfg["metric"] == "mae":
            score = mae(y_true, y_pred)
            norm = normalized_regression_score(score)
        else:
            score = accuracy(y_true, y_pred)
            norm = score
        endpoint_scores[name] = {"metric": cfg["metric"], "score": round(score, 4), "normalized": round(norm, 4), "n": n}
        normalized.append(norm)

    final_score = sum(normalized) / len(normalized) if normalized else 0.0
    scores = {"final_score": round(final_score, 4), "endpoints": endpoint_scores}
    Path(args.output).write_text(json.dumps(scores, indent=2), encoding="utf-8")
    print(json.dumps(scores, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
