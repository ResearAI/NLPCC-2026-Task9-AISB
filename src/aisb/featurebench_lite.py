"""Helpers for running the public T1 FeatureBench-lite task subset."""
from __future__ import annotations

import json
import importlib.util
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


def load_manifest(featurebench_dir: str | Path) -> dict[str, Any]:
    root = Path(featurebench_dir)
    manifest_path = root / "manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError(f"FeatureBench-lite manifest not found: {manifest_path}")
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def iter_tasks(featurebench_dir: str | Path) -> list[dict[str, Any]]:
    root = Path(featurebench_dir)
    manifest = load_manifest(root)
    tasks = []
    for item in manifest.get("tasks", []):
        task = dict(item)
        task["root"] = root / str(item["task_relpath"])
        task["repo"] = task["root"] / "repo"
        task["task_md"] = task["root"] / "TASK.md"
        tasks.append(task)
    return tasks


def prepare_task_workspace(task: dict[str, Any], work_root: str | Path) -> Path:
    work_root = Path(work_root)
    dst = work_root / str(task["task_id"])
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(Path(task["repo"]), dst)
    return dst


def _supports_pytest() -> bool:
    return importlib.util.find_spec("pytest") is not None


def _run_simple_tests(repo_dir: Path, timeout_sec: int, env: dict[str, str]) -> dict[str, Any]:
    runner = r"""
from __future__ import annotations

import importlib.util
import inspect
import pathlib
import sys
import traceback

repo = pathlib.Path(sys.argv[1])
src = repo / "src"
tests = repo / "tests"
if str(src) not in sys.path:
    sys.path.insert(0, str(src))
if str(tests) not in sys.path:
    sys.path.insert(0, str(tests))

failures = []
executed = 0
for path in sorted(tests.glob("test_*.py")):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    for name, func in sorted(inspect.getmembers(module, inspect.isfunction)):
        if not name.startswith("test_"):
            continue
        executed += 1
        try:
            func()
        except Exception:
            failures.append(f"{path.name}::{name}\n{traceback.format_exc()}")

if failures:
    print("\n\n".join(failures))
    raise SystemExit(1)

print(f"simple-test-runner: {executed} tests passed")
"""
    result = subprocess.run(
        [sys.executable, "-c", runner, str(repo_dir)],
        cwd=str(repo_dir),
        env=env,
        capture_output=True,
        text=True,
        timeout=timeout_sec,
    )
    return {
        "result": "pass" if result.returncode == 0 else "fail",
        "returncode": result.returncode,
        "stdout_tail": result.stdout[-2000:],
        "stderr_tail": result.stderr[-2000:],
    }


def run_task_tests(
    repo_dir: str | Path,
    command: list[str] | None = None,
    timeout_sec: int = 180,
    env: dict[str, str] | None = None,
) -> dict[str, Any]:
    repo_dir = Path(repo_dir)
    cmd = command or ["python", "-m", "pytest", "tests", "-q"]
    merged_env = {
        **os.environ,
        "PYTHONPATH": str(repo_dir / "src"),
    }
    if env:
        merged_env.update(env)
    try:
        if any("pytest" in part for part in cmd) and not _supports_pytest():
            return _run_simple_tests(repo_dir, timeout_sec=timeout_sec, env=merged_env)
        result = subprocess.run(
            cmd,
            cwd=str(repo_dir),
            env=merged_env,
            capture_output=True,
            text=True,
            timeout=timeout_sec,
        )
        return {
            "result": "pass" if result.returncode == 0 else "fail",
            "returncode": result.returncode,
            "stdout_tail": result.stdout[-2000:],
            "stderr_tail": result.stderr[-2000:],
        }
    except subprocess.TimeoutExpired as exc:
        return {
            "result": "timeout",
            "returncode": -1,
            "stdout_tail": (exc.stdout or "")[-2000:] if exc.stdout else "",
            "stderr_tail": (exc.stderr or "")[-2000:] if exc.stderr else f"TIMEOUT: {timeout_sec}s",
        }


def run_task(
    task: dict[str, Any],
    work_root: str | Path,
    timeout_sec: int = 180,
    env: dict[str, str] | None = None,
) -> dict[str, Any]:
    repo_dir = prepare_task_workspace(task, work_root)
    command = list(task.get("test_command") or ["python", "-m", "pytest", "tests", "-q"])
    outcome = run_task_tests(repo_dir, command=command, timeout_sec=timeout_sec, env=env)
    return {
        "task_id": task["task_id"],
        "title": task.get("title", ""),
        "workspace": str(repo_dir),
        **outcome,
    }


def run_suite(
    featurebench_dir: str | Path,
    work_root: str | Path,
    timeout_sec: int = 180,
    env: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    results = []
    for task in iter_tasks(featurebench_dir):
        results.append(run_task(task, work_root=work_root, timeout_sec=timeout_sec, env=env))
    return results
