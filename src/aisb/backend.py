"""Local filesystem backend for AISB/NLPCC self-service submissions."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
import uuid
import zipfile
from pathlib import Path
from typing import Any

from aisb.submission import validate_submission


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


ROOT = repo_root()
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def default_backend_dir() -> Path:
    return ROOT / ".aisb_backend"


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _copy_or_unpack_submission(source: Path, destination: Path) -> None:
    if source.is_dir():
        shutil.copytree(source, destination, dirs_exist_ok=True)
        return
    if source.suffix.lower() != ".zip":
        raise ValueError("Submission source must be a directory or .zip package")
    with zipfile.ZipFile(source) as archive:
        archive.extractall(destination)


def create_job(submission: str | Path, track: str | None = None, backend_dir: str | Path | None = None) -> dict[str, Any]:
    backend = Path(backend_dir).resolve() if backend_dir else default_backend_dir()
    jobs_dir = backend / "jobs"
    job_id = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:8]
    job_dir = jobs_dir / job_id
    submission_dir = job_dir / "submission"
    _copy_or_unpack_submission(Path(submission).resolve(), submission_dir)

    validation = validate_submission(submission_dir, strict=True)
    inferred_track = track or validation.get("metadata", {}).get("direction") or "T1"
    status = {
        "job_id": job_id,
        "state": "QUEUED" if validation["ok"] else "REJECTED",
        "track": inferred_track,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "submission_dir": str(submission_dir),
        "validation": validation,
    }
    _write_json(job_dir / "status.json", status)
    return status


def run_job(job_id: str, backend_dir: str | Path | None = None, execute: bool = False) -> dict[str, Any]:
    """Run backend evaluation for a queued job.

    By default this evaluates the submitted package without re-running the AI scientist.
    Passing execute=True also runs the Docker execution stage through EvalOrchestrator.
    """
    backend = Path(backend_dir).resolve() if backend_dir else default_backend_dir()
    job_dir = backend / "jobs" / job_id
    status_path = job_dir / "status.json"
    if not status_path.exists():
        raise FileNotFoundError(f"Unknown job: {job_id}")
    status = _read_json(status_path)
    if status["state"] == "REJECTED":
        return status

    submission_dir = Path(status["submission_dir"])
    validation = validate_submission(submission_dir, strict=True)
    status["validation"] = validation
    if not validation["ok"]:
        status["state"] = "REJECTED"
        _write_json(status_path, status)
        return status

    from tracks.shared.security.eval_orchestrator import EvalOrchestrator

    orchestrator = EvalOrchestrator(
        submission_path=submission_dir,
        track=status["track"],
        data_dir=repo_root() / "data" / "standard_test",
        execute_submission=execute,
    )
    report = orchestrator.run()
    report_path = job_dir / "report.json"
    report.save(report_path)
    score = _run_official_evaluator(submission_dir, status["track"], job_dir)

    status.update({
        "state": "COMPLETED",
        "completed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "verdict": report.final_verdict,
        "cas_score": report.cas_score,
        "official_score": score,
        "final_score": score.get("scores", {}).get("final_score") if isinstance(score.get("scores"), dict) else None,
        "report_path": str(report_path),
    })
    _write_json(status_path, status)
    _update_leaderboard(backend, status)
    return status


def job_status(job_id: str, backend_dir: str | Path | None = None) -> dict[str, Any]:
    backend = Path(backend_dir).resolve() if backend_dir else default_backend_dir()
    status_path = backend / "jobs" / job_id / "status.json"
    if not status_path.exists():
        raise FileNotFoundError(f"Unknown job: {job_id}")
    return _read_json(status_path)


def job_report(job_id: str, backend_dir: str | Path | None = None) -> dict[str, Any]:
    status = job_status(job_id, backend_dir)
    report_path = status.get("report_path")
    if not report_path:
        return status
    return _read_json(Path(report_path))


def _run_official_evaluator(submission_dir: Path, track: str, job_dir: Path) -> dict[str, Any]:
    """Run the track evaluator after integrity replay.

    The backend score is the authoritative leaderboard input. It intentionally
    ignores self-reported values in results.json.
    """
    track = track.upper()
    output = job_dir / "scores.json"
    root = repo_root()
    if track == "T1":
        reference = root / "data" / "competition" / "T1" / "dev"
        cmd = [
            sys.executable,
            str(root / "benchmarks" / "nlpcc" / "T1" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission_dir),
            "--reference",
            str(reference),
            "--output",
            str(output),
        ]
    elif track == "T2":
        reference = root / "data" / "competition" / "T2" / "dev" / "formalmath_dev.json"
        cmd = [
            sys.executable,
            str(root / "benchmarks" / "nlpcc" / "T2" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission_dir),
            "--reference",
            str(reference),
            "--output",
            str(output),
            "--timeout",
            "180",
        ]
    elif track == "T3":
        reference = root / "data" / "competition" / "T3" / "dev"
        cmd = [
            sys.executable,
            str(root / "benchmarks" / "nlpcc" / "T3" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission_dir),
            "--reference",
            str(reference),
            "--output",
            str(output),
        ]
    else:
        return {"ok": False, "error": f"unknown track: {track}"}

    try:
        result = subprocess.run(cmd, cwd=str(root), capture_output=True, text=True, timeout=600)
    except (OSError, subprocess.TimeoutExpired) as exc:
        return {"ok": False, "error": str(exc), "scores": {"final_score": 0.0}}

    payload: dict[str, Any]
    if output.exists():
        try:
            payload = json.loads(output.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            payload = {"scores": {"final_score": 0.0}, "error": f"invalid score json: {exc}"}
    else:
        payload = {"scores": {"final_score": 0.0}, "error": "evaluator did not write scores.json"}
    if "scores" not in payload:
        payload = {"scores": payload}
    payload.update({
        "ok": result.returncode == 0,
        "command": cmd,
        "stdout_tail": result.stdout[-2000:],
        "stderr_tail": result.stderr[-2000:],
    })
    output.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return payload


def _update_leaderboard(backend: Path, status: dict[str, Any]) -> None:
    leaderboard_path = backend / "leaderboard.json"
    if leaderboard_path.exists():
        leaderboard = _read_json(leaderboard_path)
    else:
        leaderboard = {"entries": []}
    metadata = status.get("validation", {}).get("metadata", {})
    results = status.get("validation", {}).get("results", {})
    entry = {
        "job_id": status["job_id"],
        "track": metadata.get("track"),
        "direction": metadata.get("direction"),
        "team_name": metadata.get("team_name"),
        "system_name": metadata.get("system_name"),
        "verdict": status.get("verdict"),
        "final_score": status.get("final_score") if status.get("final_score") is not None else results.get("final_score") or results.get("score"),
        "cas_score": status.get("cas_score"),
        "completed_at": status.get("completed_at"),
    }
    leaderboard["entries"] = [item for item in leaderboard.get("entries", []) if item.get("job_id") != status["job_id"]]
    leaderboard["entries"].append(entry)
    _write_json(leaderboard_path, leaderboard)
