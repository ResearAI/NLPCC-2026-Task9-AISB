"""T2 metrics."""
from __future__ import annotations


def proof_rate(results: list[dict]) -> float:
    if not results:
        return 0.0
    return sum(1 for item in results if item.get("verified") is True) / len(results)
