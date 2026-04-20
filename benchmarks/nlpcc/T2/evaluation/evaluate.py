#!/usr/bin/env python3
"""Evaluate T2 Lean proof submissions."""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from metrics import proof_rate

LAKEFILE = """import Lake
open Lake DSL

package aisb_proof where
  leanOptions := #[
    ⟨`autoImplicit, false⟩
  ]

@[default_target]
lean_lib AisbProof where
  srcDir := "."

require mathlib from git
  "https://github.com/leanprover-community/mathlib4.git"
  @ "v4.15.0"
"""

TOOLCHAIN = "leanprover/lean4:v4.15.0\n"
FORBIDDEN_PROOF_TOKENS = ("sorry", "admit", "axiom")


def default_reference_path() -> Path:
    return Path(__file__).resolve().parents[4] / "data" / "competition" / "T2" / "dev" / "formalmath_dev.json"


def load_reference(path: Path) -> dict[str, dict]:
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(data, list):
        raise ValueError(f"T2 reference must be a list: {path}")
    rows: dict[str, dict] = {}
    for item in data:
        if not isinstance(item, dict):
            continue
        theorem_id = str(item.get("theorem_names") or item.get("id") or "").strip()
        autoformalization = str(item.get("autoformalization") or "").strip()
        if theorem_id and autoformalization and not theorem_id.startswith("#"):
            rows[theorem_id] = item
    return rows


def theorem_header(autoformalization: str) -> str:
    idx = autoformalization.rfind(":= by")
    if idx >= 0:
        return autoformalization[:idx + 5]
    idx = autoformalization.rfind(" by")
    if idx >= 0:
        return autoformalization[:idx + 3]
    return autoformalization


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def extract_lean_block(value: str) -> str:
    fenced = re.search(r"```(?:lean)?\s*(.*?)```", value, flags=re.DOTALL | re.IGNORECASE)
    return fenced.group(1).strip() if fenced else value.strip()


def assemble_expected_code(task: dict, submitted: dict) -> tuple[str, str | None]:
    """Bind a submitted proof to the organizer-provided theorem statement."""
    autoformalization = str(task.get("autoformalization") or "")
    expected_header = theorem_header(autoformalization)
    proof_body = str(submitted.get("proof") or "").strip()
    lean_code = str(submitted.get("lean_code") or "").strip()

    if lean_code:
        candidate = extract_lean_block(lean_code)
        if normalize_space(expected_header) not in normalize_space(candidate):
            return "", "submitted Lean code does not contain the official theorem statement"
        return candidate, None

    if proof_body:
        proof_body = extract_lean_block(proof_body)
        if normalize_space(expected_header) in normalize_space(proof_body):
            return proof_body, None
        code = expected_header + "\n  " + proof_body.replace("\n", "\n  ") + "\n"
        return code, None

    return "", "empty_proof"


def has_forbidden_tokens(code: str) -> str | None:
    uncommented = []
    for line in code.splitlines():
        uncommented.append(line.split("--", 1)[0])
    lowered = "\n".join(uncommented).lower()
    for token in FORBIDDEN_PROOF_TOKENS:
        if re.search(rf"\b{re.escape(token)}\b", lowered):
            return token
    return None


def run_lean(code: str, timeout: int) -> dict:
    forbidden = has_forbidden_tokens(code)
    if forbidden:
        return {"verified": False, "error": f"forbidden proof token: {forbidden}"}
    with tempfile.TemporaryDirectory(prefix="aisb_t2_") as tmp:
        work = Path(tmp)
        path = work / "Candidate.lean"
        path.write_text(code, encoding="utf-8")
        (work / "lakefile.lean").write_text(LAKEFILE, encoding="utf-8")
        (work / "lean-toolchain").write_text(TOOLCHAIN, encoding="utf-8")
        try:
            if shutil.which("lean") and shutil.which("lake"):
                try:
                    subprocess.run(["lake", "update"], cwd=str(work), capture_output=True, text=True, timeout=timeout)
                except (OSError, subprocess.TimeoutExpired):
                    pass
                cmd = ["lake", "env", "lean", "Candidate.lean"]
                run_cwd = str(work)
            else:
                cmd = [
                    "docker",
                    "run",
                    "--rm",
                    "--user",
                    "root",
                    "-v",
                    f"{work.resolve()}:/input",
                    "aisb-t2:latest",
                    "bash",
                    "-lc",
                    "cd /opt/aisb/lean-template && lake env lean /input/Candidate.lean",
                ]
                run_cwd = None
            result = subprocess.run(cmd, cwd=run_cwd, capture_output=True, text=True, timeout=timeout)
        except (OSError, subprocess.TimeoutExpired) as exc:
            return {"verified": False, "error": str(exc)}
        verified = result.returncode == 0 and "declaration uses 'sorry'" not in result.stderr
        return {
            "verified": verified,
            "stdout": result.stdout[-2000:],
            "stderr": result.stderr[-2000:],
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--submission", required=True, help="Directory containing proofs.json")
    parser.add_argument("--reference", help="Official T2 theorem JSON file")
    parser.add_argument("--output", default="scores.json")
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()

    reference_path = Path(args.reference).resolve() if args.reference else default_reference_path()
    reference = load_reference(reference_path)
    proofs_path = Path(args.submission) / "proofs.json"
    proofs = json.loads(proofs_path.read_text(encoding="utf-8-sig")) if proofs_path.exists() else []
    if not isinstance(proofs, list):
        proofs = []
    submitted_by_id = {
        str(item.get("id") or item.get("theorem_id") or "").strip(): item
        for item in proofs
        if isinstance(item, dict)
    }

    results = []
    for theorem_id, task in reference.items():
        item = submitted_by_id.get(theorem_id)
        if item is None:
            checked = {"verified": False, "error": "missing_proof"}
        else:
            code, error = assemble_expected_code(task, item)
            checked = {"verified": False, "error": error} if error else run_lean(code, args.timeout)
            if "verified" in item:
                checked["submitted_verified"] = item.get("verified")
        checked["id"] = theorem_id
        results.append(checked)

    scores = {
        "proof_rate": round(proof_rate(results), 4),
        "final_score": round(proof_rate(results), 4),
        "checked": len(results),
    }
    Path(args.output).write_text(json.dumps({"scores": scores, "results": results}, indent=2), encoding="utf-8")
    print(json.dumps(scores, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
