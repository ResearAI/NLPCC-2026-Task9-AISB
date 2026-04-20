#!/usr/bin/env python3
"""Evaluate T1 predictions."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from metrics import exact_match_accuracy, pass_rate


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--submission", required=True)
    parser.add_argument("--reference", required=True)
    parser.add_argument("--output", default="scores.json")
    args = parser.parse_args()

    submission = Path(args.submission)
    reference = Path(args.reference)

    hle = exact_match_accuracy(
        load_json(submission / "hle_predictions.json", []),
        load_json(reference / "hle_answers.json", []),
    )
    featurebench = pass_rate(load_json(submission / "featurebench_results.json", []))
    combined = 0.6 * hle + 0.4 * featurebench
    scores = {
        "hle_accuracy": round(hle, 4),
        "featurebench_pass_rate": round(featurebench, 4),
        "final_score": round(combined, 4),
    }
    Path(args.output).write_text(json.dumps(scores, indent=2), encoding="utf-8")
    print(json.dumps(scores, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
