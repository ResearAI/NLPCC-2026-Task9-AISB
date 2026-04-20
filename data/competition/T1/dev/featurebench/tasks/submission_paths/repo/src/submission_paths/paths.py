from __future__ import annotations

import re
from pathlib import Path


def _slugify(value: str) -> str:
    slug = re.sub(r"\s+", "_", value.strip())
    return slug or "team"


def resolve_output_paths(root: str | Path, team_name: str, track: str) -> dict[str, Path]:
    root = Path(root)
    # BUG: path prefix keeps the raw track casing and an unstable folder shape.
    prefix = f"{track}_{_slugify(team_name)}"
    submission = root / "submission" / prefix
    logs = submission / "logs"
    paper = submission / "paper"
    return {
        "submission": submission,
        "logs": logs,
        "paper": paper,
    }
