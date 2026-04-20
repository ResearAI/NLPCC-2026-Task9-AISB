"""Submission validation and packaging utilities for AISB/NLPCC."""
from __future__ import annotations

import json
import re
import zipfile
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any


REQUIRED_METADATA_FIELDS = {
    "team_name",
    "system_name",
    "track",
    "direction",
    "autonomy_level",
    "contact_email",
}

VALID_TRACKS = {"paper", "benchmark", "A", "B"}
VALID_DIRECTIONS = {"T1", "T2", "T3"}
VALID_AUTONOMY = {"fully_autonomous", "human_assisted"}

STRICT_REQUIRED_FILES = [
    "metadata.json",
    "results.json",
    "paper/paper.pdf",
    "paper/source/main.tex",
    "paper/source/refs.bib",
    "paper/claims.json",
    "logs/iterations.jsonl",
    "logs/experiment_log.jsonl",
    "logs/api_calls.jsonl",
]

LEGACY_COMPATIBLE_FILES = [
    "metadata.json",
    "results.json",
    "logs/iterations.jsonl",
]

EXECUTION_ENTRYPOINTS = [
    "code/run.py",
    "run.py",
]


@dataclass
class ValidationFinding:
    severity: str
    message: str
    path: str | None = None
    code: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _read_json(path: Path, findings: list[ValidationFinding]) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        findings.append(ValidationFinding(
            "CRITICAL", f"Invalid JSON: {exc}", str(path), "invalid_json"))
    except OSError as exc:
        findings.append(ValidationFinding(
            "CRITICAL", f"Could not read file: {exc}", str(path), "read_error"))
    return None


def load_jsonl(path: Path, findings: list[ValidationFinding] | None = None) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    if not path.exists():
        if findings is not None:
            findings.append(ValidationFinding("CRITICAL", "Missing JSONL file", str(path), "missing_file"))
        return entries
    for line_no, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError as exc:
            if findings is not None:
                findings.append(ValidationFinding(
                    "CRITICAL", f"Invalid JSONL at line {line_no}: {exc}", str(path), "invalid_jsonl"))
            continue
        if not isinstance(value, dict):
            if findings is not None:
                findings.append(ValidationFinding(
                    "CRITICAL", f"JSONL line {line_no} is not an object", str(path), "invalid_jsonl_object"))
            continue
        entries.append(value)
    return entries


def validate_metadata(root: Path, findings: list[ValidationFinding], strict: bool = True) -> dict[str, Any]:
    path = root / "metadata.json"
    if not path.exists():
        findings.append(ValidationFinding("CRITICAL", "Missing required file: metadata.json", "metadata.json", "missing_file"))
        return {}

    meta = _read_json(path, findings)
    if not isinstance(meta, dict):
        findings.append(ValidationFinding("CRITICAL", "metadata.json must be a JSON object", "metadata.json", "invalid_metadata"))
        return {}

    if not strict:
        return meta

    missing = sorted(REQUIRED_METADATA_FIELDS - set(meta))
    for field in missing:
        findings.append(ValidationFinding("CRITICAL", f"metadata.json missing required field: {field}", "metadata.json", "missing_metadata_field"))

    if meta.get("track") not in VALID_TRACKS:
        findings.append(ValidationFinding(
            "CRITICAL",
            "metadata.track must be paper or benchmark; legacy A/B is still accepted",
            "metadata.json",
            "invalid_track",
        ))

    if meta.get("direction") not in VALID_DIRECTIONS:
        findings.append(ValidationFinding("CRITICAL", "metadata.direction must be T1, T2, or T3", "metadata.json", "invalid_direction"))

    if meta.get("autonomy_level") not in VALID_AUTONOMY:
        findings.append(ValidationFinding(
            "CRITICAL",
            "metadata.autonomy_level must be fully_autonomous or human_assisted",
            "metadata.json",
            "invalid_autonomy_level",
        ))

    if meta.get("autonomy_level") == "human_assisted" and not meta.get("human_contributions"):
        findings.append(ValidationFinding(
            "CRITICAL",
            "human_contributions is required when autonomy_level is human_assisted",
            "metadata.json",
            "missing_human_contributions",
        ))

    email = str(meta.get("contact_email", ""))
    if email and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        findings.append(ValidationFinding("WARNING", "contact_email does not look like an email address", "metadata.json", "weak_email"))

    return meta


def _validate_required_files(root: Path, strict: bool, findings: list[ValidationFinding]) -> None:
    required = STRICT_REQUIRED_FILES if strict else LEGACY_COMPATIBLE_FILES
    for rel in required:
        if not (root / rel).exists():
            findings.append(ValidationFinding("CRITICAL", f"Missing required file: {rel}", rel, "missing_file"))

    if not strict:
        for rel in STRICT_REQUIRED_FILES:
            if not (root / rel).exists():
                findings.append(ValidationFinding("WARNING", f"Missing official-layout file: {rel}", rel, "legacy_layout"))


def find_execution_entrypoint(root: str | Path) -> str | None:
    root = Path(root).resolve()
    for rel in EXECUTION_ENTRYPOINTS:
        if (root / rel).exists():
            return rel
    return None


def _validate_iterations(root: Path, findings: list[ValidationFinding]) -> dict[str, Any]:
    path = root / "logs" / "iterations.jsonl"
    entries = load_jsonl(path, findings)
    if not entries:
        findings.append(ValidationFinding("CRITICAL", "logs/iterations.jsonl is empty or unreadable", "logs/iterations.jsonl", "empty_iterations"))
        return {"count": 0, "success_rate": 0.0}

    for idx, entry in enumerate(entries, 1):
        for field in ("iteration", "timestamp", "status"):
            if field not in entry:
                findings.append(ValidationFinding(
                    "WARNING",
                    f"iteration log entry {idx} missing field: {field}",
                    "logs/iterations.jsonl",
                    "weak_iteration_entry",
                ))

    success = sum(1 for entry in entries if str(entry.get("status", "")).upper() == "SUCCESS")
    rate = success / len(entries)
    if rate < 0.3:
        findings.append(ValidationFinding(
            "WARNING",
            f"Experiment success rate is below 30%: {success}/{len(entries)}",
            "logs/iterations.jsonl",
            "low_success_rate",
        ))
    return {"count": len(entries), "success": success, "success_rate": rate, "entries": entries}


def _validate_claims(root: Path, findings: list[ValidationFinding]) -> dict[str, Any]:
    path = root / "paper" / "claims.json"
    if not path.exists():
        return {"claims": []}

    data = _read_json(path, findings)
    if isinstance(data, dict):
        claims = data.get("claims", [])
    else:
        claims = data

    if not isinstance(claims, list):
        findings.append(ValidationFinding("CRITICAL", "paper/claims.json must be a list or an object with a claims list", "paper/claims.json", "invalid_claims"))
        return {"claims": []}

    for idx, claim in enumerate(claims, 1):
        if not isinstance(claim, dict):
            findings.append(ValidationFinding("CRITICAL", f"claim {idx} is not an object", "paper/claims.json", "invalid_claim"))
            continue
        for field in ("claim_id", "experiment_id", "metric_name", "value"):
            if field not in claim:
                findings.append(ValidationFinding("WARNING", f"claim {idx} missing field: {field}", "paper/claims.json", "weak_claim"))

    return {"claims": claims}


def compute_structured_cas(root: Path, findings: list[ValidationFinding]) -> float:
    """Compute a structured CAS using claims.json and experiment_log.jsonl."""
    claims_info = _validate_claims(root, findings)
    claims = claims_info["claims"]
    if not claims:
        findings.append(ValidationFinding("WARNING", "No structured claims found; CAS falls back to neutral 1.0", "paper/claims.json", "no_claims"))
        return 1.0

    experiment_log = load_jsonl(root / "logs" / "experiment_log.jsonl", findings)
    by_id = {str(item.get("experiment_id") or item.get("id") or item.get("iteration")): item for item in experiment_log}

    matched = 0
    total = 0
    for claim in claims:
        if not isinstance(claim, dict):
            continue
        total += 1
        exp_id = str(claim.get("experiment_id", ""))
        metric_name = str(claim.get("metric_name", ""))
        expected = claim.get("value")
        exp = by_id.get(exp_id)
        if exp is None:
            findings.append(ValidationFinding("WARNING", f"claim {claim.get('claim_id', total)} references missing experiment_id={exp_id}", "paper/claims.json", "claim_missing_experiment"))
            continue
        status = str(exp.get("status", "")).upper()
        if status not in {"SUCCESS", "COMPLETED", "PASS"}:
            findings.append(ValidationFinding("WARNING", f"claim {claim.get('claim_id', total)} references non-success experiment status={status}", "paper/claims.json", "claim_failed_experiment"))
            continue
        metrics = exp.get("metrics") or exp.get("metrics_after") or exp.get("after") or {}
        actual = metrics.get(metric_name) if isinstance(metrics, dict) else None
        if actual is None:
            findings.append(ValidationFinding("WARNING", f"claim {claim.get('claim_id', total)} metric not found in experiment log: {metric_name}", "paper/claims.json", "claim_missing_metric"))
            continue
        try:
            actual_f = float(actual)
            expected_f = float(expected)
        except (TypeError, ValueError):
            if str(actual) == str(expected):
                matched += 1
            continue
        tolerance = max(abs(expected_f) * 0.02, 1e-6)
        if abs(actual_f - expected_f) <= tolerance:
            matched += 1
        else:
            findings.append(ValidationFinding(
                "WARNING",
                f"claim {claim.get('claim_id', total)} value mismatch: expected {expected_f}, log has {actual_f}",
                "paper/claims.json",
                "claim_value_mismatch",
            ))

    if total == 0:
        return 1.0
    cas = matched / total
    if cas < 0.5:
        findings.append(ValidationFinding("CRITICAL", f"Structured CAS below threshold: {cas:.2f}", "paper/claims.json", "cas_below_threshold"))
    return cas


def validate_submission(root: str | Path, strict: bool = True) -> dict[str, Any]:
    root = Path(root).resolve()
    findings: list[ValidationFinding] = []

    if not root.exists() or not root.is_dir():
        findings.append(ValidationFinding("CRITICAL", "Submission directory does not exist", str(root), "missing_submission_dir"))
        return {"ok": False, "root": str(root), "findings": [f.to_dict() for f in findings]}

    _validate_required_files(root, strict, findings)
    metadata = validate_metadata(root, findings, strict=strict)
    iteration_info = _validate_iterations(root, findings) if (root / "logs" / "iterations.jsonl").exists() else {"count": 0}
    cas = compute_structured_cas(root, findings) if (root / "paper" / "claims.json").exists() else 1.0
    execution_entrypoint = find_execution_entrypoint(root)
    if execution_entrypoint is None:
        findings.append(ValidationFinding(
            "WARNING",
            "No executable submission entrypoint found; backend --execute-submission will be skipped or fail. Add code/run.py or run.py.",
            "code/run.py",
            "missing_execution_entrypoint",
        ))

    if (root / "results.json").exists():
        results = _read_json(root / "results.json", findings)
        if not isinstance(results, dict):
            findings.append(ValidationFinding("CRITICAL", "results.json must be a JSON object", "results.json", "invalid_results"))
    else:
        results = {}

    critical = [finding for finding in findings if finding.severity == "CRITICAL"]
    return {
        "ok": not critical,
        "root": str(root),
        "strict": strict,
        "metadata": metadata,
        "results": results,
        "iterations": {k: v for k, v in iteration_info.items() if k != "entries"},
        "cas_score": cas,
        "execution_entrypoint": execution_entrypoint,
        "findings": [finding.to_dict() for finding in findings],
    }


def package_submission(root: str | Path, output: str | Path | None = None, strict: bool = True) -> Path:
    root = Path(root).resolve()
    report = validate_submission(root, strict=strict)
    if not report["ok"]:
        messages = "; ".join(f["message"] for f in report["findings"] if f["severity"] == "CRITICAL")
        raise ValueError(f"Submission validation failed: {messages}")

    if output is None:
        output = root.with_suffix(".zip")
    output = Path(output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(root.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(root).as_posix()
            if rel.startswith(".git/") or "__pycache__/" in rel or rel.endswith(".pyc"):
                continue
            archive.write(path, rel)
    return output
