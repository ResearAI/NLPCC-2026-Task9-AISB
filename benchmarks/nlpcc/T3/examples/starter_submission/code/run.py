#!/usr/bin/env python3
"""Starter T3 replay entrypoint.

This script is intentionally CPU-only and dependency-free. It regenerates the
frozen mean/majority baseline predictions from the mounted AISB data directory.
"""
from __future__ import annotations

import csv
import json
import os
import statistics
from datetime import datetime, timezone
from pathlib import Path


ENDPOINTS = {
    "caco2_wang": "regression",
    "herg": "classification",
    "ames": "classification",
    "cyp3a4_veith": "classification",
    "lipophilicity_az": "regression",
}


def read_rows(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = []
        for row in csv.DictReader(handle):
            first_value = next(iter(row.values()), "")
            if isinstance(first_value, str) and first_value.startswith("#"):
                continue
            rows.append(row)
        return rows


def parse_label(row: dict) -> float | None:
    try:
        value = row.get("Y")
        if value is None or value == "":
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def prediction_value(values: list[float], task: str) -> float:
    if not values:
        return 0.0
    if task == "classification":
        positives = sum(1 for value in values if value >= 0.5)
        return 1.0 if positives >= len(values) / 2 else 0.0
    return float(statistics.fmean(values))


def row_id(row: dict, index: int) -> str:
    return str(row.get("Drug_ID") or row.get("id") or index)


def is_accessible_dir(path: Path) -> bool:
    try:
        return path.exists() and path.is_dir() and os.access(path, os.R_OK | os.X_OK)
    except OSError:
        return False


def find_data_root(submission_root: Path) -> Path:
    candidates = [
        os.environ.get("AISB_DATA_DIR"),
        "/opt/aisb/data",
        str(submission_root.parent / "data" / "dev"),
        str(submission_root.parent / "bench" / "data" / "dev"),
    ]
    for parent in [submission_root, *submission_root.parents]:
        candidates.append(str(parent / "data" / "dev"))
        candidates.append(str(parent / "data"))
    for item in candidates:
        if item:
            path = Path(item)
            if is_accessible_dir(path):
                return path
    raise FileNotFoundError("Could not find AISB T3 data directory")


def packaged_predictions_exist(submission_root: Path) -> bool:
    return all((submission_root / f"{endpoint}_predictions.json").exists() for endpoint in ENDPOINTS)


def generate_dev_oof(rows: list[dict], task: str, folds: int = 5) -> list[dict]:
    clean_rows = [(row, value) for row in rows if (value := parse_label(row)) is not None]
    values = [value for _, value in clean_rows]
    predictions = []
    for index, (row, _) in enumerate(clean_rows):
        fold = index % folds
        train_values = [value for j, value in enumerate(values) if j % folds != fold]
        predictions.append({"id": row_id(row, index), "prediction": prediction_value(train_values, task)})
    return predictions


def generate_holdout(data_root: Path, endpoint: str, task: str) -> list[dict]:
    train_values: list[float] = []
    for split in ("train", "valid"):
        path = data_root / f"{endpoint}_{split}.csv"
        if path.exists():
            for row in read_rows(path):
                value = parse_label(row)
                if value is not None:
                    train_values.append(value)
    test_path = data_root / f"{endpoint}_test.csv"
    if not test_path.exists():
        return []
    value = prediction_value(train_values, task)
    return [{"id": row_id(row, index), "prediction": value} for index, row in enumerate(read_rows(test_path))]


def main() -> int:
    submission_root = Path(__file__).resolve().parents[1]
    logs_dir = submission_root / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)

    try:
        data_root = find_data_root(submission_root)
    except FileNotFoundError:
        if not packaged_predictions_exist(submission_root):
            raise
        marker = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "SUCCESS",
            "message": "T3 starter replay reused packaged predictions because no organizer data mount was available",
        }
        manifest = {
            "baseline_name": "starter_frozen_mean_majority",
            "data_root": None,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "mode": "packaged_predictions_reused",
            "endpoints": {
                endpoint: {
                    "task": task,
                    "policy": "packaged_predictions_reused",
                }
                for endpoint, task in ENDPOINTS.items()
            },
        }
        (submission_root / "t3_baseline_manifest.json").write_text(
            json.dumps(manifest, indent=2),
            encoding="utf-8",
        )
        (logs_dir / "starter_replay.json").write_text(json.dumps(marker, indent=2), encoding="utf-8")
        print("AISB T3 starter baseline reused packaged predictions")
        return 0

    manifest = {
        "baseline_name": "starter_frozen_mean_majority",
        "data_root": str(data_root),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "endpoints": {},
    }

    for endpoint, task in ENDPOINTS.items():
        dev_path = data_root / f"{endpoint}_dev.csv"
        if dev_path.exists():
            rows = read_rows(dev_path)
            predictions = generate_dev_oof(rows, task)
            policy = "public_dev_out_of_fold_mean_or_majority"
        else:
            predictions = generate_holdout(data_root, endpoint, task)
            policy = "train_valid_mean_or_majority_for_test"
        (submission_root / f"{endpoint}_predictions.json").write_text(
            json.dumps({"predictions": predictions}, indent=2),
            encoding="utf-8",
        )
        manifest["endpoints"][endpoint] = {
            "task": task,
            "n": len(predictions),
            "policy": policy,
        }

    (submission_root / "t3_baseline_manifest.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )
    marker = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "SUCCESS",
        "message": "T3 starter baseline predictions regenerated",
    }
    (logs_dir / "starter_replay.json").write_text(json.dumps(marker, indent=2), encoding="utf-8")
    print("AISB T3 starter baseline completed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
