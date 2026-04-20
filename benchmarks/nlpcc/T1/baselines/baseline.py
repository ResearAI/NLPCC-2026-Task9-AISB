#!/usr/bin/env python3
"""Runnable T1 baseline for the public release package."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[4]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from aisb.featurebench_lite import iter_tasks, prepare_task_workspace, run_task_tests

SUMMARY_FIX = """from __future__ import annotations

from .model import RunRecord


def build_summary(records: list[RunRecord]) -> dict[str, object]:
    if not records:
        return {
            "count": 0,
            "success_count": 0,
            "mean_score": 0.0,
            "best_run_id": None,
        }
    success = [item for item in records if item.status.upper() == "SUCCESS"]
    mean_score = sum(item.score for item in success) / len(success) if success else 0.0
    best_pool = success or records
    best = max(best_pool, key=lambda item: (item.score, item.run_id))
    return {
        "count": len(records),
        "success_count": len(success),
        "mean_score": round(mean_score, 4),
        "best_run_id": best.run_id,
    }


def markdown_table(records: list[RunRecord]) -> str:
    header = "| run_id | status | score | notes |\\n| --- | --- | ---: | --- |"
    if not records:
        return header
    rows = [header]
    for item in sorted(records, key=lambda item: (-item.score, item.run_id)):
        rows.append(f"| {item.run_id} | {item.status} | {item.score:.3f} | {item.notes} |")
    return "\\n".join(rows)
"""

CONFIG_FIX = """from __future__ import annotations


def deep_merge(base: dict, override: dict) -> dict:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(merged.get(key), dict) and isinstance(value, dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged
"""

PATHS_FIX = """from __future__ import annotations

import re
from pathlib import Path


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "team"


def resolve_output_paths(root: str | Path, team_name: str, track: str) -> dict[str, Path]:
    root = Path(root)
    prefix = f"{track.lower()}-{_slugify(team_name)}"
    submission = root / prefix / "submission"
    logs = submission / "logs"
    paper = submission / "paper"
    return {
        "submission": submission,
        "logs": logs,
        "paper": paper,
    }
"""

CLEAN_FIX = """from __future__ import annotations


def drop_comment_rows(rows: list[dict]) -> list[dict]:
    cleaned = []
    for row in rows:
        item_id = str(row.get("id", "")).strip()
        if not item_id or item_id.startswith("#"):
            continue
        cleaned.append(row)
    return cleaned


def dedupe_by_id(rows: list[dict]) -> list[dict]:
    latest: dict[str, dict] = {}
    for row in rows:
        latest[str(row["id"])] = row
    return [latest[key] for key in sorted(latest)]


def normalize_prediction(value: object) -> str:
    return str(value).strip().rstrip(".").lower()
"""

FEATUREBENCH_FIXES = {
    "run_report_summary": {
        Path("src/run_report/summary.py"): SUMMARY_FIX,
    },
    "submission_paths": {
        Path("src/submission_paths/config.py"): CONFIG_FIX,
        Path("src/submission_paths/paths.py"): PATHS_FIX,
    },
    "prediction_cleanup": {
        Path("src/prediction_cleanup/clean.py"): CLEAN_FIX,
    },
}


def bench_dir() -> Path:
    value = os.environ.get("AISB_BENCH_DIR")
    if value:
        return Path(value).resolve()
    return Path(__file__).resolve().parents[1]


def main() -> int:
    bench = bench_dir()
    out = Path("submission")
    out.mkdir(exist_ok=True)

    hle_questions = bench / "data" / "dev" / "hle_dev.json"
    questions = json.loads(hle_questions.read_text(encoding="utf-8")) if hle_questions.exists() else []
    hle_predictions = [{"id": item["id"], "prediction": "A"} for item in questions if isinstance(item, dict) and item.get("id")]
    (out / "hle_predictions.json").write_text(json.dumps(hle_predictions, indent=2), encoding="utf-8")

    featurebench_dir = bench / "data" / "dev" / "featurebench"
    results = []
    if featurebench_dir.exists():
        work_root = bench / ".baseline_featurebench"
        for task in iter_tasks(featurebench_dir):
            repo_dir = prepare_task_workspace(task, work_root)
            for relpath, content in FEATUREBENCH_FIXES.get(str(task["task_id"]), {}).items():
                target = repo_dir / relpath
                target.write_text(content, encoding="utf-8")
            outcome = run_task_tests(
                repo_dir,
                command=list(task.get("test_command") or ["python", "-m", "pytest", "tests", "-q"]),
                timeout_sec=120,
            )
            results.append(
                {
                    "task_id": task["task_id"],
                    "title": task.get("title", ""),
                    "workspace": str(repo_dir),
                    **outcome,
                }
            )
    (out / "featurebench_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
