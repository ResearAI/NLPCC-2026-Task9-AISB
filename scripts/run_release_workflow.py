#!/usr/bin/env python3
"""Official AISB/NLPCC release workflow wrapper."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _contains_skip_writeup(agent_cmd: str) -> bool:
    lowered = agent_cmd.lower()
    return "--skip_writeup" in lowered or "--skip-writeup" in lowered


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run the official AISB/NLPCC end-to-end workflow")
    parser.add_argument("track", choices=["T1", "T2", "T3"])
    parser.add_argument("--agent-cmd", required=True, help="Participant AI Scientist command")
    parser.add_argument("--submission-dir", help="Override submission output directory")
    parser.add_argument("--backend-dir", help="Override backend working directory")
    parser.add_argument("--output", help="Override packaged submission zip path")
    parser.add_argument("--no-build-docker", action="store_true", help="Skip Docker image build during workflow setup")
    parser.add_argument("--legacy-format", action="store_true", help="Allow old partial layout with warnings")
    parser.add_argument("--allow-skip-writeup", action="store_true", help="Allow third-party agent flags that skip writeup/submission generation")
    args = parser.parse_args(argv)

    if not args.allow_skip_writeup and _contains_skip_writeup(args.agent_cmd):
        print(
            "Refusing to run because --skip_writeup/--skip-writeup disables paper/submission generation.",
            file=sys.stderr,
        )
        return 2

    cmd = [
        sys.executable,
        str(repo_root() / "aisb.py"),
        "workflow",
        "run",
        args.track,
        "--agent-cmd",
        args.agent_cmd,
        "--run-backend",
        "--execute-submission",
    ]
    if not args.no_build_docker:
        cmd.append("--build-docker")
    if args.submission_dir:
        cmd.extend(["--submission-dir", args.submission_dir])
    if args.backend_dir:
        cmd.extend(["--backend-dir", args.backend_dir])
    if args.output:
        cmd.extend(["--output", args.output])
    if args.legacy_format:
        cmd.append("--legacy-format")

    return subprocess.run(cmd, cwd=str(repo_root())).returncode


if __name__ == "__main__":
    raise SystemExit(main())
