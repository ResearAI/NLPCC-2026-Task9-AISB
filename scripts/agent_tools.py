#!/usr/bin/env python3
"""Agent-facing workspace and submission tools for AISB/NLPCC."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from aisb.backend import create_job, run_job
from aisb.bench import prepare_benchmark
from aisb.featurebench_lite import run_suite
from aisb.submission import package_submission, validate_submission


def _print_json(data: object) -> None:
    print(json.dumps(data, indent=2, ensure_ascii=False))


def cmd_workspace_init(args: argparse.Namespace) -> int:
    prepared = prepare_benchmark(args.track, dest=args.dest, build_docker=args.build_docker)
    workspace_root = Path(prepared["path"])
    submission_dir = workspace_root / "submission"
    submission_dir.mkdir(parents=True, exist_ok=True)
    for child in [
        submission_dir / "paper" / "source" / "figures",
        submission_dir / "logs",
        submission_dir / "code",
    ]:
        child.mkdir(parents=True, exist_ok=True)
    result = {
        "ok": True,
        "track": args.track.upper(),
        "workspace": str(workspace_root),
        "submission_dir": str(submission_dir),
        "prepared": prepared,
    }
    _print_json(result)
    return 0


def cmd_t1_featurebench_run(args: argparse.Namespace) -> int:
    bench_dir = Path(args.bench_dir).resolve()
    featurebench_dir = bench_dir / "data" / "dev" / "featurebench"
    work_root = Path(args.work_root).resolve() if args.work_root else bench_dir / ".featurebench_work"
    work_root.mkdir(parents=True, exist_ok=True)
    results = run_suite(featurebench_dir, work_root=work_root, timeout_sec=args.timeout)
    output = Path(args.output).resolve() if args.output else bench_dir / "submission" / "featurebench_results.json"
    output.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    _print_json({"ok": True, "output": str(output), "results": results})
    return 0


def cmd_submission_validate(args: argparse.Namespace) -> int:
    report = validate_submission(args.submission, strict=not args.legacy_format)
    _print_json(report)
    return 0 if report["ok"] else 1


def cmd_submission_package(args: argparse.Namespace) -> int:
    path = package_submission(args.submission, args.output, strict=not args.legacy_format)
    print(path)
    return 0


def cmd_submission_replay(args: argparse.Namespace) -> int:
    status = create_job(args.submission, track=args.track, backend_dir=args.backend_dir)
    if status["state"] != "REJECTED":
        status = run_job(status["job_id"], backend_dir=args.backend_dir, execute=True)
    _print_json(status)
    return 0 if status.get("state") != "REJECTED" else 1


def cmd_eval_track(args: argparse.Namespace) -> int:
    track = args.track.upper()
    bench_dir = Path(args.bench_dir).resolve()
    submission = Path(args.submission).resolve()
    output = Path(args.output).resolve() if args.output else submission / "scores.json"
    if track == "T1":
        cmd = [
            sys.executable,
            str(PROJECT_ROOT / "benchmarks" / "nlpcc" / "T1" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission),
            "--reference",
            str(bench_dir / "data" / "dev"),
            "--output",
            str(output),
        ]
    elif track == "T2":
        reference = bench_dir / "data" / "dev" / "formalmath_dev.json"
        if not reference.exists():
            reference = PROJECT_ROOT / "data" / "competition" / "T2" / "dev" / "formalmath_dev.json"
        cmd = [
            sys.executable,
            str(PROJECT_ROOT / "benchmarks" / "nlpcc" / "T2" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission),
            "--reference",
            str(reference),
            "--output",
            str(output),
        ]
        if args.timeout:
            cmd.extend(["--timeout", str(args.timeout)])
    else:
        cmd = [
            sys.executable,
            str(PROJECT_ROOT / "benchmarks" / "nlpcc" / "T3" / "evaluation" / "evaluate.py"),
            "--submission",
            str(submission),
            "--reference",
            str(bench_dir / "data" / "dev"),
            "--output",
            str(output),
        ]
    result = subprocess.run(cmd, cwd=str(PROJECT_ROOT))
    return result.returncode


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AISB/NLPCC agent-facing tools")
    sub = parser.add_subparsers(dest="command", required=True)

    workspace = sub.add_parser("workspace", help="Prepare a writable benchmark workspace")
    workspace_sub = workspace.add_subparsers(dest="workspace_command", required=True)
    workspace_init = workspace_sub.add_parser("init", help="Prepare one track and scaffold a submission directory")
    workspace_init.add_argument("track", choices=["T1", "T2", "T3"])
    workspace_init.add_argument("--dest")
    workspace_init.add_argument("--build-docker", action="store_true")
    workspace_init.set_defaults(func=cmd_workspace_init)

    t1 = sub.add_parser("t1", help="T1 engineering-task helpers")
    t1_sub = t1.add_subparsers(dest="t1_command", required=True)
    t1_run = t1_sub.add_parser("run-featurebench", help="Run the public FeatureBench-lite suite and write featurebench_results.json")
    t1_run.add_argument("--bench-dir", required=True)
    t1_run.add_argument("--work-root")
    t1_run.add_argument("--output")
    t1_run.add_argument("--timeout", type=int, default=180)
    t1_run.set_defaults(func=cmd_t1_featurebench_run)

    evaluate = sub.add_parser("evaluate", help="Run a track evaluator against a local submission")
    evaluate.add_argument("track", choices=["T1", "T2", "T3"])
    evaluate.add_argument("--bench-dir", required=True)
    evaluate.add_argument("--submission", required=True)
    evaluate.add_argument("--output")
    evaluate.add_argument("--timeout", type=int)
    evaluate.set_defaults(func=cmd_eval_track)

    submission = sub.add_parser("submission", help="Submission validation, packaging, and replay")
    submission_sub = submission.add_subparsers(dest="submission_command", required=True)
    validate = submission_sub.add_parser("validate", help="Validate a submission directory")
    validate.add_argument("submission")
    validate.add_argument("--legacy-format", action="store_true")
    validate.set_defaults(func=cmd_submission_validate)

    package = submission_sub.add_parser("package", help="Package a validated submission")
    package.add_argument("submission")
    package.add_argument("--output")
    package.add_argument("--legacy-format", action="store_true")
    package.set_defaults(func=cmd_submission_package)

    replay = submission_sub.add_parser("replay", help="Run organizer-style backend replay on a local submission")
    replay.add_argument("submission")
    replay.add_argument("--track", required=True, choices=["T1", "T2", "T3"])
    replay.add_argument("--backend-dir")
    replay.set_defaults(func=cmd_submission_replay)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
