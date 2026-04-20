#!/usr/bin/env python3
"""AISB 2026 submission pre-check.

This script intentionally delegates to the shared AISB validator so CLI,
backend, and public pre-check use the same submission contract.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from aisb.submission import validate_submission


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="AISB 2026 submission pre-check")
    parser.add_argument("--dir", type=Path, required=True, help="Submission directory")
    parser.add_argument("--legacy-format", action="store_true", help="Allow old partial layout with warnings")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    args = parser.parse_args(argv)

    report = validate_submission(args.dir, strict=not args.legacy_format)
    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print("=" * 60)
        print("AISB 2026 Submission Pre-Check")
        print("=" * 60)
        print(f"Directory: {report['root']}")
        print(f"Strict official layout: {report['strict']}")
        print(f"CAS: {report.get('cas_score', 0.0):.2f}")
        print(f"Execution entrypoint: {report.get('execution_entrypoint') or 'not found'}")
        for finding in report["findings"]:
            path = f" [{finding['path']}]" if finding.get("path") else ""
            print(f"{finding['severity']:8s}{path} {finding['message']}")
        print("=" * 60)
        print("RESULT: Ready to submit" if report["ok"] else "RESULT: Issues found")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
