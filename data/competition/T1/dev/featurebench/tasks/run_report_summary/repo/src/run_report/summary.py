from __future__ import annotations

from .model import RunRecord


def build_summary(records: list[RunRecord]) -> dict[str, object]:
    if not records:
        return {
            "count": 0,
            "success_count": 0,
            "mean_score": 0.0,
            "best_run_id": None,
        }
    # BUG: mean currently uses all records and best run is picked lexicographically.
    success = [item for item in records if item.status.upper() == "SUCCESS"]
    mean_score = sum(item.score for item in records) / len(records)
    best = min(records, key=lambda item: item.run_id)
    return {
        "count": len(records),
        "success_count": len(success),
        "mean_score": round(mean_score, 4),
        "best_run_id": best.run_id,
    }


def markdown_table(records: list[RunRecord]) -> str:
    header = "| run_id | status | score | notes |\n| --- | --- | ---: | --- |"
    if not records:
        return header
    rows = [header]
    # BUG: preserves input order and inconsistent score formatting.
    for item in records:
        rows.append(f"| {item.run_id} | {item.status} | {item.score} | {item.notes} |")
    return "\n".join(rows)
