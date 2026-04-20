#!/usr/bin/env python3
"""
AISB 2026 — Evaluation Orchestrator (Stage 1→5 Pipeline)

Central pipeline that orchestrates the full submission evaluation:
  Stage 1: Validate submission format
  Stage 2: Security pre-scan (prompt injection, static analysis)
  Stage 3: Build container + inject canaries + sanitize git
  Stage 4: Run with monitoring (timeout + resource limits)
  Stage 5: Post-execution integrity checks (CAS, canary, fabrication)

Usage:
    cd E:/courese/AISB_2026
    python -m tracks.shared.security.eval_orchestrator --submission path --track T1

    or programmatically:
    from tracks.shared.security.eval_orchestrator import EvalOrchestrator
    report = EvalOrchestrator(submission_path, track="T1").run()
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path

# --- Absolute import setup: works both as module and script ---
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent  # tracks/shared/security -> project root
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))
_SRC_ROOT = _PROJECT_ROOT / "src"
if str(_SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(_SRC_ROOT))

# Hard imports — if these fail, the pipeline MUST NOT run
from tracks.shared.security.canary_injector import CanaryInjector
from tracks.shared.security.canary_checker import CanaryChecker
from tracks.shared.security.monitor import ContainerMonitor
from aisb.submission import validate_submission, compute_structured_cas, find_execution_entrypoint


@dataclass
class StageResult:
    stage: str
    passed: bool
    duration_seconds: float = 0.0
    findings: list = field(default_factory=list)
    details: dict = field(default_factory=dict)


@dataclass
class EvalReport:
    submission_path: str = ""
    track: str = ""
    started_at: str = ""
    completed_at: str = ""
    stages: list = field(default_factory=list)
    final_verdict: str = "PENDING"  # PASS / FAIL / DISQUALIFIED / ERROR
    final_score: float = 0.0
    cas_score: float = 0.0

    def add_stage(self, result: StageResult):
        self.stages.append(asdict(result))

    def to_dict(self) -> dict:
        return asdict(self)

    def save(self, path: str | Path):
        Path(path).write_text(
            json.dumps(self.to_dict(), indent=2, ensure_ascii=False),
            encoding="utf-8")


TRACK_LIMITS = {
    "T1": {"cpus": "4", "memory": "16g", "timeout": 1800, "network": "none"},
    "T2": {"cpus": "4", "memory": "16g", "timeout": 3600, "network": "none"},
    "T3": {"cpus": "4", "memory": "16g", "timeout": 7200, "network": "bridge"},
    "paper": {"cpus": "4", "memory": "16g", "timeout": 7200, "network": "bridge"},
}

TRACK_IMAGES = {
    "T1": "aisb-t1:latest",
    "T2": "aisb-t2:latest",
    "T3": "aisb-t3:latest",
    "paper": "aisb-t1:latest",
}


def _compute_cas(results: dict, iterations: list[dict]) -> float:
    """Inline CAS computation — no external import needed."""
    def extract_numbers(data, prefix=""):
        numbers = {}
        for k, v in data.items():
            key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                numbers[key] = float(v)
            elif isinstance(v, dict):
                numbers.update(extract_numbers(v, key))
        return numbers

    result_numbers = extract_numbers(results)
    if not result_numbers:
        return 1.0

    iter_numbers = set()
    for entry in iterations:
        for k, v in extract_numbers(entry).items():
            iter_numbers.add(round(v, 4))
        for field_name in ("metrics_before", "metrics_after", "before", "after"):
            if isinstance(entry.get(field_name), dict):
                for k, v in extract_numbers(entry[field_name]).items():
                    iter_numbers.add(round(v, 4))

    verified = 0
    total = 0
    tolerance = 0.02
    for key, val in result_numbers.items():
        if any(skip in key.lower() for skip in ("iteration", "duration", "cost", "total")):
            continue
        total += 1
        if any(abs(val - iv) <= abs(val * tolerance) + 1e-6 for iv in iter_numbers):
            verified += 1

    return verified / total if total > 0 else 1.0


class EvalOrchestrator:
    """Orchestrates the full evaluation pipeline. No silent failures."""

    def __init__(self, submission_path: str | Path, track: str,
                 data_dir: str | Path = "data/competition",
                 seccomp_path: str | Path = "tracks/shared/docker/aisb-seccomp.json",
                 execute_submission: bool = False,
                 strict_format: bool = True):
        self.submission_path = Path(submission_path).resolve()
        self.track = track
        self.data_dir = Path(data_dir).resolve()
        self.seccomp_path = Path(seccomp_path).resolve()
        self.limits = TRACK_LIMITS.get(track, TRACK_LIMITS["T1"])
        self.image = TRACK_IMAGES.get(track, "aisb-t1:latest")
        self.report = EvalReport(
            submission_path=str(self.submission_path),
            track=track,
            started_at=datetime.now(timezone.utc).isoformat(),
        )
        self._canary_manifest_path = None
        self._temp_data_dir = None
        self._monitor = None
        self.execute_submission = execute_submission
        self.strict_format = strict_format
        self._container_id = None

    def run(self) -> EvalReport:
        """Execute all 5 stages sequentially."""
        try:
            s1 = self._stage1_validate_format()
            self.report.add_stage(s1)
            if not s1.passed:
                self.report.final_verdict = "FAIL"
                return self._finalize()

            s2 = self._stage2_security_prescan()
            self.report.add_stage(s2)
            if not s2.passed:
                self.report.final_verdict = "DISQUALIFIED"
                return self._finalize()

            s3 = self._stage3_prepare_container()
            self.report.add_stage(s3)
            if not s3.passed:
                self.report.final_verdict = "ERROR"
                return self._finalize()

            s4 = self._stage4_execute() if self.execute_submission else self._stage4_skip_execution()
            self.report.add_stage(s4)
            if not s4.passed:
                self.report.final_verdict = "FAIL"
                return self._finalize()

            s5 = self._stage5_integrity_check()
            self.report.add_stage(s5)
            self.report.final_verdict = "DISQUALIFIED" if not s5.passed else "PASS"

        except Exception as e:
            self.report.final_verdict = "ERROR"
            self.report.stages.append(asdict(StageResult(
                stage="exception", passed=False,
                details={"error": str(e)[:1000]})))
        finally:
            self._cleanup()

        return self._finalize()

    # --- Stage 1: Format Validation ---
    def _stage1_validate_format(self) -> StageResult:
        start = time.time()
        validation = validate_submission(self.submission_path, strict=self.strict_format)
        findings = [
            {
                "severity": item["severity"],
                "msg": item["message"],
                "file": item.get("path"),
                "code": item.get("code"),
            }
            for item in validation["findings"]
        ]

        total_size = sum(f.stat().st_size for f in self.submission_path.rglob("*") if f.is_file())
        if total_size > 20 * 1024**3:
            findings.append({"severity": "CRITICAL", "msg": f"Submission too large: {total_size / 1024**3:.1f} GB"})

        critical = [f for f in findings if f["severity"] == "CRITICAL"]
        return StageResult(
            stage="format_validation", passed=len(critical) == 0,
            duration_seconds=round(time.time() - start, 2),
            findings=findings,
            details={"validation": validation})

    # --- Stage 2: Security Pre-Scan ---
    def _stage2_security_prescan(self) -> StageResult:
        start = time.time()
        findings = []

        for pf in list(self.submission_path.rglob("paper*.md")) + list(self.submission_path.rglob("paper*.tex")):
            findings.extend(self._scan_prompt_injection(pf))

        for pyf in self.submission_path.rglob("*.py"):
            findings.extend(self._scan_code(pyf))

        critical = [f for f in findings if f["severity"] == "CRITICAL"]
        return StageResult(
            stage="security_prescan", passed=len(critical) == 0,
            duration_seconds=round(time.time() - start, 2), findings=findings)

    def _scan_prompt_injection(self, path: Path) -> list[dict]:
        findings = []
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
            zwc = ["\u200b", "\u200c", "\u200d", "\u200e", "\u200f", "\ufeff"]
            for c in zwc:
                if c in content:
                    findings.append({"severity": "CRITICAL", "file": str(path.name),
                                     "msg": f"Zero-width character U+{ord(c):04X} detected"})

            injection_patterns = [
                r"\[SYSTEM\]", r"<\|im_start\|>", r"IGNORE ALL PREVIOUS",
                r"you are now", r"forget your instructions",
                r"rate this paper 10", r"give.*score.*6",
            ]
            for pat in injection_patterns:
                if re.search(pat, content, re.IGNORECASE):
                    findings.append({"severity": "HIGH", "file": str(path.name),
                                     "msg": f"Prompt injection pattern: {pat}"})
        except (OSError, UnicodeDecodeError) as e:
            findings.append({"severity": "WARNING", "file": str(path.name),
                             "msg": f"Could not scan: {type(e).__name__}"})
        return findings

    def _scan_code(self, path: Path) -> list[dict]:
        findings = []
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
            forbidden = [
                (r"mock\.patch|monkeypatch", "Eval function mocking attempt"),
                (r"/opt/aisb/eval|/opt/aisb/answers", "Forbidden path access"),
                (r"os\.chmod.*\d{3}", "Permission modification attempt"),
                (r"git.*log.*--all|git.*show.*origin|git.*branch\s+-a", "Git history snooping"),
                (r"socket\.connect|requests\.get\(.*http", "Network access attempt"),
            ]
            for pat, desc in forbidden:
                if re.search(pat, content, re.IGNORECASE):
                    findings.append({"severity": "HIGH", "file": str(path.name), "msg": desc})
        except (OSError, UnicodeDecodeError) as e:
            findings.append({"severity": "WARNING", "file": str(path.name),
                             "msg": f"Could not scan: {type(e).__name__}"})
        return findings

    # --- Stage 3: Prepare Container ---
    def _stage3_prepare_container(self) -> StageResult:
        start = time.time()
        findings = []

        # Canary injection — HARD call, no silent skip
        injector = CanaryInjector()
        data_track_dir = self.data_dir / self.track
        if data_track_dir.exists():
            self._temp_data_dir = Path(tempfile.mkdtemp(prefix="aisb_data_"))
            shutil.copytree(data_track_dir, self._temp_data_dir / "data", dirs_exist_ok=True)
            manifest = injector.inject_directory(self._temp_data_dir / "data")
            self._canary_manifest_path = self._temp_data_dir / "canary_manifest.json"
            manifest.save(self._canary_manifest_path)
            findings.append({"severity": "INFO",
                             "msg": f"Injected {len(manifest.tokens)} canary tokens"})
        else:
            findings.append({"severity": "INFO", "msg": f"No data dir for {self.track}, skipping canary injection"})

        # Git sanitization
        for git_dir in self.submission_path.rglob(".git"):
            if git_dir.is_dir():
                sanitize_script = Path(__file__).parent / "sanitize_git.sh"
                result = subprocess.run(
                    ["bash", str(sanitize_script), str(git_dir.parent)],
                    capture_output=True, text=True, timeout=60)
                if result.returncode != 0:
                    findings.append({"severity": "WARNING",
                                     "msg": f"Git sanitization failed: {result.stderr[:200]}"})
                else:
                    findings.append({"severity": "INFO",
                                     "msg": f"Sanitized git in {git_dir.parent.name}"})

        # Hash test files
        test_hashes = {}
        test_dir = self.data_dir / self.track / "tests"
        if test_dir.exists():
            for tf in test_dir.rglob("*"):
                if tf.is_file():
                    test_hashes[str(tf.relative_to(test_dir))] = hashlib.sha256(tf.read_bytes()).hexdigest()

        return StageResult(
            stage="prepare_container", passed=True,
            duration_seconds=round(time.time() - start, 2),
            findings=findings, details={"test_file_hashes": test_hashes})

    # --- Stage 4: Execute with REAL monitoring ---
    def _stage4_skip_execution(self) -> StageResult:
        return StageResult(
            stage="execution",
            passed=True,
            duration_seconds=0.0,
            findings=[{"severity": "INFO", "msg": "Skipped AI scientist execution; evaluating submitted package only."}],
            details={"execute_submission": False},
        )

    def _stage4_execute(self) -> StageResult:
        start = time.time()
        findings = []
        timeout = self.limits["timeout"]
        entrypoint = find_execution_entrypoint(self.submission_path)
        if entrypoint is None:
            findings.append({
                "severity": "HIGH",
                "msg": "No executable submission entrypoint found. Expected code/run.py or run.py in the submission package.",
            })
            return StageResult(
                stage="execution",
                passed=False,
                duration_seconds=round(time.time() - start, 2),
                findings=findings,
                details={"execute_submission": True},
            )

        # Build docker run command — DETACHED to get container ID for monitoring
        cmd = [
            "docker", "run", "-d",  # detached
            "--user", "agent",
            "--read-only",
            "--tmpfs", "/tmp:size=4g",
            "--tmpfs", "/home/agent/.cache:size=512m",
            f"--memory={self.limits['memory']}",
            f"--cpus={self.limits['cpus']}",
            "--pids-limit", "512",
            "--security-opt", "no-new-privileges",
        ]

        if self.limits["network"] == "none":
            cmd.append("--network=none")

        if self.seccomp_path.exists():
            cmd.extend(["--security-opt", f"seccomp={self.seccomp_path}"])

        # Mount data (use canary-injected copy if available)
        data_mount = (self._temp_data_dir / "data") if self._temp_data_dir else (self.data_dir / self.track)
        if data_mount.exists():
            cmd.extend(["-v", f"{data_mount}:/opt/aisb/data:ro"])

        output_dir = self.submission_path / "output"
        output_dir.mkdir(exist_ok=True)
        cmd.extend(["-v", f"{self.submission_path}:/home/agent/submission:rw"])
        cmd.extend(["-w", "/home/agent/submission"])

        cmd.extend([
            "-e", f"AISB_TRACK={self.track}",
            "-e", "AISB_MODE=submit",
            "-e", f"BUDGET_USD={os.environ.get('BUDGET_USD', '10')}",
            "-e", f"MAX_ITERATIONS={os.environ.get('MAX_ITERATIONS', '20')}",
        ])
        cmd.extend([
            self.image,
            "python",
            f"/home/agent/submission/{entrypoint}",
        ])

        try:
            # Start container (detached) → get container ID
            create_result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if create_result.returncode != 0:
                findings.append({"severity": "HIGH", "msg": f"Container start failed: {create_result.stderr[:500]}"})
                return StageResult(stage="execution", passed=False,
                                   duration_seconds=round(time.time() - start, 2), findings=findings)

            container_id = create_result.stdout.strip()[:12]
            self._container_id = container_id
            findings.append({"severity": "INFO", "msg": f"Container started: {container_id}"})

            # Start monitor
            monitor_log_dir = self.submission_path / "monitor_logs"
            self._monitor = ContainerMonitor(
                container_id=container_id,
                log_dir=str(monitor_log_dir),
                interval_seconds=10.0)
            self._monitor.start()
            findings.append({"severity": "INFO", "msg": "Runtime monitor started"})

            # Wait for container to finish (with timeout)
            wait_result = subprocess.run(
                ["docker", "wait", container_id],
                capture_output=True, text=True, timeout=timeout)

            # Stop monitor
            self._monitor.stop()
            monitor_report = self._monitor.get_report()
            findings.append({"severity": "INFO",
                             "msg": f"Monitor: {monitor_report['total_events']} events, {monitor_report['anomaly_count']} anomalies"})

            if monitor_report["anomaly_count"] > 0:
                findings.append({"severity": "HIGH",
                                 "msg": f"Monitor anomalies: {json.dumps(monitor_report['anomalies'][:3])}"})

            # Get exit code
            exit_code = int(wait_result.stdout.strip()) if wait_result.stdout.strip().isdigit() else 1

            # Capture logs
            logs_result = subprocess.run(
                ["docker", "logs", container_id],
                capture_output=True, text=True, timeout=10)
            findings.append({"severity": "INFO", "msg": f"Container exited with code {exit_code}"})

            # Remove container
            subprocess.run(["docker", "rm", "-f", container_id],
                           capture_output=True, timeout=10)

            return StageResult(
                stage="execution", passed=(exit_code == 0),
                duration_seconds=round(time.time() - start, 2),
                findings=findings,
                details={"exit_code": exit_code,
                         "entrypoint": entrypoint,
                         "stdout_lines": len(logs_result.stdout.splitlines()),
                         "monitor_anomalies": monitor_report["anomaly_count"]})

        except subprocess.TimeoutExpired:
            if self._monitor:
                self._monitor.stop()
            if self._container_id:
                subprocess.run(["docker", "rm", "-f", self._container_id],
                               capture_output=True, timeout=10)
            findings.append({"severity": "CRITICAL", "msg": f"Timeout after {timeout}s"})
            return StageResult(stage="execution", passed=False,
                               duration_seconds=timeout, findings=findings)

    # --- Stage 5: Integrity Check ---
    def _stage5_integrity_check(self) -> StageResult:
        start = time.time()
        findings = []
        cas_score = 1.0
        output_dir = self.submission_path

        # 5a. Canary token scan — HARD call
        if self._canary_manifest_path and self._canary_manifest_path.exists():
            checker = CanaryChecker(manifest_path=self._canary_manifest_path)
            canary_report = checker.scan_directory(output_dir)
            if not canary_report["clean"]:
                findings.append({"severity": "CRITICAL",
                                 "msg": f"Canary token leaked! {canary_report['total_findings']} findings"})
            else:
                findings.append({"severity": "INFO",
                                 "msg": f"Canary scan clean ({canary_report['scanned_files']} files)"})

        # 5b. CAS computation from structured claims and experiment logs.
        iter_path = output_dir / "logs" / "iterations.jsonl"
        results_path = output_dir / "results.json"

        if (output_dir / "paper" / "claims.json").exists() and (output_dir / "logs" / "experiment_log.jsonl").exists():
            local_findings = []
            cas_score = compute_structured_cas(output_dir, local_findings)
            self.report.cas_score = cas_score
            for item in local_findings:
                findings.append({
                    "severity": item.severity,
                    "msg": item.message,
                    "file": item.path,
                    "code": item.code,
                })
            if cas_score >= 0.5:
                findings.append({"severity": "INFO", "msg": f"Structured CAS={cas_score:.2f} (above threshold)"})

        if iter_path.exists() and results_path.exists():
            iterations = []
            for line in iter_path.read_text(encoding="utf-8").strip().splitlines():
                iterations.append(json.loads(line))
            results = json.loads(results_path.read_text(encoding="utf-8"))
            if isinstance(results.get("final_score"), (int, float)) and not isinstance(results.get("final_score"), bool):
                self.report.final_score = float(results["final_score"])

            if self.report.cas_score == 0.0:
                cas_score = _compute_cas(results, iterations)
                self.report.cas_score = cas_score

            if cas_score < 0.5:
                findings.append({"severity": "CRITICAL", "msg": f"CAS={cas_score:.2f} < 0.5 threshold"})
            else:
                findings.append({"severity": "INFO", "msg": f"CAS={cas_score:.2f} (above threshold)"})

            # ESR check
            total = len(iterations)
            success = sum(1 for it in iterations if it.get("status") == "SUCCESS")
            esr = success / total if total > 0 else 0
            if esr < 0.3 and total > 0:
                findings.append({"severity": "HIGH", "msg": f"ESR={esr:.0%} below 30% threshold"})

        # 5c. Prompt injection post-scan
        for paper_file in list(output_dir.rglob("paper*.md")) + list(output_dir.rglob("paper*.tex")):
            findings.extend(self._scan_prompt_injection(paper_file))

        # 5d. api_calls.jsonl consistency
        api_log = output_dir / "logs" / "api_calls.jsonl"
        if api_log.exists():
            try:
                calls = [json.loads(l) for l in api_log.read_text(encoding="utf-8").strip().splitlines()]
                error_calls = [c for c in calls if c.get("status") == "error"]
                if len(error_calls) > len(calls) * 0.5:
                    findings.append({"severity": "WARNING",
                                     "msg": f"{len(error_calls)}/{len(calls)} API calls failed"})
                findings.append({"severity": "INFO", "msg": f"API log: {len(calls)} calls recorded"})
            except Exception:
                pass

        critical = [f for f in findings if f["severity"] == "CRITICAL"]
        return StageResult(
            stage="integrity_check", passed=len(critical) == 0,
            duration_seconds=round(time.time() - start, 2),
            findings=findings, details={"cas_score": cas_score})

    def _cleanup(self):
        """Clean up temp data directory."""
        if self._temp_data_dir and self._temp_data_dir.exists():
            shutil.rmtree(self._temp_data_dir, ignore_errors=True)

    def _finalize(self) -> EvalReport:
        self.report.completed_at = datetime.now(timezone.utc).isoformat()
        return self.report


def main():
    parser = argparse.ArgumentParser(description="AISB 2026 Evaluation Orchestrator")
    parser.add_argument("--submission", required=True, help="Path to submission directory")
    parser.add_argument("--track", required=True, choices=["T1", "T2", "T3", "paper"])
    parser.add_argument("--data-dir", default="data/competition")
    parser.add_argument("--output", default=None, help="Save report to file")
    parser.add_argument("--execute-submission", action="store_true",
                        help="Run the submitted AI scientist/container before integrity checks")
    parser.add_argument("--legacy-format", action="store_true",
                        help="Use legacy relaxed submission layout checks")
    args = parser.parse_args()

    orchestrator = EvalOrchestrator(
        submission_path=args.submission,
        track=args.track,
        data_dir=args.data_dir,
        execute_submission=args.execute_submission,
        strict_format=not args.legacy_format,
    )
    report = orchestrator.run()

    print(json.dumps(report.to_dict(), indent=2))
    if args.output:
        report.save(args.output)
    sys.exit(0 if report.final_verdict == "PASS" else 1)


if __name__ == "__main__":
    main()
