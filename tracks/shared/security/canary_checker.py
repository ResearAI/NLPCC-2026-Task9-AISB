#!/usr/bin/env python3
"""
AISB 2026 — Canary Token Checker

Post-execution scan: checks if any injected canary tokens leaked into the submission output.
If a canary is found, the submission accessed test labels or restricted data.

Usage:
    checker = CanaryChecker(manifest_path="canary_manifest.json")
    report = checker.scan_directory("/path/to/submission/output")
    if not report["clean"]:
        print("CRITICAL: Canary token leaked!")
"""
import json
import re
from pathlib import Path


CANARY_PATTERN = re.compile(r"AISB-CANARY-[a-f0-9]{12}")


class CanaryChecker:
    """Scans output files for leaked canary tokens."""

    def __init__(self, manifest_path: str | Path | None = None,
                 tokens: set[str] | None = None):
        """
        Args:
            manifest_path: Path to canary_manifest.json (from CanaryInjector)
            tokens: Or provide tokens directly as a set
        """
        if manifest_path:
            data = json.loads(Path(manifest_path).read_text(encoding="utf-8"))
            self.tokens = {t["token"] for t in data["tokens"]}
        elif tokens:
            self.tokens = tokens
        else:
            self.tokens = set()

    def scan_directory(self, output_dir: str | Path) -> dict:
        """
        Scan all files in the output directory for canary token leaks.

        Returns:
            {
                "clean": bool,
                "leaked_tokens": [...],
                "scanned_files": int,
                "findings": [{"file": str, "token": str, "line": int}],
            }
        """
        output_dir = Path(output_dir)
        findings = []
        scanned = 0
        leaked = set()

        for f in sorted(output_dir.rglob("*")):
            if f.is_dir():
                continue
            # Skip binary files
            if f.suffix in (".png", ".jpg", ".jpeg", ".gif", ".pdf", ".pkl",
                            ".pt", ".pth", ".h5", ".hdf5", ".npy", ".npz"):
                continue

            scanned += 1
            try:
                content = f.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue

            # Check for any canary pattern (even unknown ones)
            for match in CANARY_PATTERN.finditer(content):
                token = match.group()
                if token in self.tokens:
                    # Known canary — definitive leak
                    line_num = content[:match.start()].count("\n") + 1
                    findings.append({
                        "file": str(f.relative_to(output_dir)),
                        "token": token,
                        "line": line_num,
                        "severity": "CRITICAL",
                        "match_type": "known_canary",
                    })
                    leaked.add(token)
                else:
                    # Unknown canary pattern — suspicious
                    line_num = content[:match.start()].count("\n") + 1
                    findings.append({
                        "file": str(f.relative_to(output_dir)),
                        "token": token,
                        "line": line_num,
                        "severity": "HIGH",
                        "match_type": "unknown_canary_pattern",
                    })

        return {
            "clean": len(findings) == 0,
            "leaked_tokens": sorted(leaked),
            "scanned_files": scanned,
            "total_findings": len(findings),
            "findings": findings,
        }

    def scan_text(self, text: str) -> list[str]:
        """Quick scan a string for canary tokens. Returns list of found tokens."""
        found = []
        for match in CANARY_PATTERN.finditer(text):
            token = match.group()
            if token in self.tokens:
                found.append(token)
        return found
