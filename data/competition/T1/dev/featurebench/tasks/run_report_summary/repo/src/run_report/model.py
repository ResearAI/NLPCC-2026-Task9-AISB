from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class RunRecord:
    run_id: str
    score: float
    status: str
    notes: str = ""
