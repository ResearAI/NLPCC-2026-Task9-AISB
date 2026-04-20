"""Command line interface for AISB/NLPCC benchmark self-service workflows."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from aisb.backend import create_job, job_report, job_status, run_job
from aisb.bench import benchmark_status, build_docker_image, list_benchmarks, prepare_benchmark, smoke_benchmark
from aisb.submission import package_submission, validate_submission


def _print_json(data: object) -> None:
    print(json.dumps(data, indent=2, ensure_ascii=False))


def cmd_bench_list(args: argparse.Namespace) -> int:
    benches = list_benchmarks()
    if args.json:
        _print_json(benches)
    else:
        for item in benches:
            status = "READY" if item["ready"] else "NOT_READY"
            image = "image:yes" if item["image_exists"] else "image:no"
            print(f"{item['track']}: {item['name']} [{status}, {image}]")
            for note in item["notes"]:
                print(f"  - {note}")
    return 0


def cmd_bench_prepare(args: argparse.Namespace) -> int:
    result = prepare_benchmark(args.track, dest=args.dest, build_docker=args.build_docker)
    _print_json(result)
    if result.get("docker") and result["docker"]["returncode"] != 0:
        return result["docker"]["returncode"]
    return 0


def cmd_bench_build(args: argparse.Namespace) -> int:
    result = build_docker_image(args.track)
    _print_json(result)
    return int(result["returncode"])


def cmd_bench_smoke(args: argparse.Namespace) -> int:
    result = smoke_benchmark(args.track, backend_dir=args.backend_dir)
    _print_json(result)
    return 0 if result["ok"] else 1


def cmd_bench_run(args: argparse.Namespace) -> int:
    if not args.agent_cmd:
        print("--agent-cmd is required", file=sys.stderr)
        return 2
    bench_dir = Path(args.bench_dir).resolve() if args.bench_dir else Path(".aisb") / "benches" / args.track.upper()
    if not bench_dir.exists():
        print(f"Benchmark directory not found: {bench_dir}. Run `aisb bench prepare {args.track}` first.", file=sys.stderr)
        return 1
    submission_dir = Path(args.submission_dir).resolve()
    submission_dir.mkdir(parents=True, exist_ok=True)
    env = {
        **__import__("os").environ,
        "AISB_TRACK": args.track.upper(),
        "AISB_BENCH_DIR": str(bench_dir.resolve()),
        "AISB_SUBMISSION_DIR": str(submission_dir),
    }
    result = subprocess.run(args.agent_cmd, shell=True, cwd=str(bench_dir), env=env)
    return result.returncode


def cmd_workflow_run(args: argparse.Namespace) -> int:
    track = args.track.upper()
    status = benchmark_status(track)
    should_build = args.build_docker or not status.image_exists
    prepared = prepare_benchmark(track, dest=args.bench_dir, build_docker=should_build)

    if not args.agent_cmd:
        _print_json({
            "ok": False,
            "prepared": prepared,
            "error": "--agent-cmd is required for workflow run",
        })
        return 2

    submission_dir = Path(args.submission_dir).resolve()
    submission_dir.mkdir(parents=True, exist_ok=True)
    env = {
        **__import__("os").environ,
        "AISB_TRACK": track,
        "AISB_BENCH_DIR": prepared["path"],
        "AISB_SUBMISSION_DIR": str(submission_dir),
    }
    agent = subprocess.run(args.agent_cmd, shell=True, cwd=prepared["path"], env=env)
    if agent.returncode != 0:
        _print_json({"ok": False, "prepared": prepared, "agent_returncode": agent.returncode})
        return agent.returncode

    validation = validate_submission(submission_dir, strict=not args.legacy_format)
    if not validation["ok"]:
        _print_json({"ok": False, "prepared": prepared, "validation": validation})
        return 1

    package_path = package_submission(submission_dir, args.output, strict=not args.legacy_format)
    status = create_job(package_path, track=track, backend_dir=args.backend_dir)
    if args.run_backend and status["state"] != "REJECTED":
        status = run_job(status["job_id"], backend_dir=args.backend_dir, execute=args.execute_submission)
    _print_json({
        "ok": status["state"] != "REJECTED",
        "track": track,
        "prepared": prepared,
        "submission": str(submission_dir),
        "package": str(package_path),
        "backend": status,
    })
    return 0 if status["state"] != "REJECTED" else 1


def cmd_submit_validate(args: argparse.Namespace) -> int:
    report = validate_submission(args.submission, strict=not args.legacy_format)
    _print_json(report)
    return 0 if report["ok"] else 1


def cmd_submit_package(args: argparse.Namespace) -> int:
    try:
        output = package_submission(args.submission, args.output, strict=not args.legacy_format)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(output)
    return 0


def cmd_submit_upload(args: argparse.Namespace) -> int:
    status = create_job(args.submission, track=args.track, backend_dir=args.backend_dir)
    _print_json(status)
    if args.run and status["state"] != "REJECTED":
        status = run_job(status["job_id"], backend_dir=args.backend_dir, execute=args.execute_submission)
        _print_json(status)
    return 0 if status["state"] != "REJECTED" else 1


def cmd_submit_status(args: argparse.Namespace) -> int:
    _print_json(job_status(args.job_id, backend_dir=args.backend_dir))
    return 0


def cmd_submit_report(args: argparse.Namespace) -> int:
    _print_json(job_report(args.job_id, backend_dir=args.backend_dir))
    return 0


def cmd_backend_run(args: argparse.Namespace) -> int:
    status = run_job(args.job_id, backend_dir=args.backend_dir, execute=args.execute_submission)
    _print_json(status)
    return 0 if status.get("state") == "COMPLETED" else 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="aisb", description="AISB/NLPCC benchmark self-service CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    bench = sub.add_parser("bench", help="Benchmark discovery and preparation")
    bench_sub = bench.add_subparsers(dest="bench_command", required=True)

    bench_list = bench_sub.add_parser("list", help="List T1/T2/T3 benchmark readiness")
    bench_list.add_argument("--json", action="store_true")
    bench_list.set_defaults(func=cmd_bench_list)

    bench_prepare = bench_sub.add_parser("prepare", help="Prepare a benchmark working directory")
    bench_prepare.add_argument("track", choices=["T1", "T2", "T3"])
    bench_prepare.add_argument("--dest", help="Destination directory; default .aisb/benches/<track>")
    bench_prepare.add_argument("--build-docker", action="store_true", help="Build the track Docker image after copying files")
    bench_prepare.set_defaults(func=cmd_bench_prepare)

    bench_build = bench_sub.add_parser("build-docker", help="Build a track Docker image")
    bench_build.add_argument("track", choices=["T1", "T2", "T3"])
    bench_build.set_defaults(func=cmd_bench_build)

    bench_smoke = bench_sub.add_parser("smoke", help="Run local acceptance smoke test for a track")
    bench_smoke.add_argument("track", choices=["T1", "T2", "T3"])
    bench_smoke.add_argument("--backend-dir")
    bench_smoke.set_defaults(func=cmd_bench_smoke)

    bench_run = bench_sub.add_parser("run", help="Run an AI Scientist agent against a prepared benchmark")
    bench_run.add_argument("track", choices=["T1", "T2", "T3"])
    bench_run.add_argument("--bench-dir")
    bench_run.add_argument("--submission-dir", default="submission")
    bench_run.add_argument("--agent-cmd", help="Agent command to execute")
    bench_run.set_defaults(func=cmd_bench_run)

    submit = sub.add_parser("submit", help="Submission validation, packaging, and backend upload")
    submit_sub = submit.add_subparsers(dest="submit_command", required=True)

    submit_validate = submit_sub.add_parser("validate", help="Validate a submission directory")
    submit_validate.add_argument("submission")
    submit_validate.add_argument("--legacy-format", action="store_true")
    submit_validate.set_defaults(func=cmd_submit_validate)

    submit_package = submit_sub.add_parser("package", help="Validate and zip a submission directory")
    submit_package.add_argument("submission")
    submit_package.add_argument("--output")
    submit_package.add_argument("--legacy-format", action="store_true")
    submit_package.set_defaults(func=cmd_submit_package)

    submit_upload = submit_sub.add_parser("upload", help="Create a backend job from a submission directory or zip")
    submit_upload.add_argument("submission")
    submit_upload.add_argument("--track", choices=["T1", "T2", "T3"])
    submit_upload.add_argument("--backend-dir")
    submit_upload.add_argument("--run", action="store_true", help="Run backend evaluation immediately")
    submit_upload.add_argument("--execute-submission", action="store_true", help="Also execute the submission container")
    submit_upload.set_defaults(func=cmd_submit_upload)

    submit_status = submit_sub.add_parser("status", help="Show backend job status")
    submit_status.add_argument("job_id")
    submit_status.add_argument("--backend-dir")
    submit_status.set_defaults(func=cmd_submit_status)

    submit_report = submit_sub.add_parser("report", help="Show backend job report")
    submit_report.add_argument("job_id")
    submit_report.add_argument("--backend-dir")
    submit_report.set_defaults(func=cmd_submit_report)

    backend = sub.add_parser("backend", help="Backend evaluator controls")
    backend_sub = backend.add_subparsers(dest="backend_command", required=True)
    backend_run = backend_sub.add_parser("run", help="Run a queued backend job")
    backend_run.add_argument("job_id")
    backend_run.add_argument("--backend-dir")
    backend_run.add_argument("--execute-submission", action="store_true")
    backend_run.set_defaults(func=cmd_backend_run)

    workflow = sub.add_parser("workflow", help="One-command participant workflow")
    workflow_sub = workflow.add_subparsers(dest="workflow_command", required=True)
    workflow_run = workflow_sub.add_parser("run", help="Prepare, run agent, validate, package, and upload")
    workflow_run.add_argument("track", choices=["T1", "T2", "T3"])
    workflow_run.add_argument("--agent-cmd", required=True)
    workflow_run.add_argument("--bench-dir")
    workflow_run.add_argument("--submission-dir", default="submission")
    workflow_run.add_argument("--output")
    workflow_run.add_argument("--backend-dir")
    workflow_run.add_argument("--build-docker", action="store_true")
    workflow_run.add_argument("--run-backend", action="store_true")
    workflow_run.add_argument("--execute-submission", action="store_true")
    workflow_run.add_argument("--legacy-format", action="store_true")
    workflow_run.set_defaults(func=cmd_workflow_run)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
