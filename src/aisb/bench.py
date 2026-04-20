"""Benchmark discovery and preparation helpers."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

import yaml


BENCHMARKS: dict[str, dict[str, Any]] = {
    "T1": {
        "name": "T1 AI/CS Reasoning & Engineering",
        "source_dir": "benchmarks/nlpcc/T1",
        "dockerfile": "tracks/shared/docker/Dockerfile.t1",
        "image": "aisb-t1:latest",
        "data_source": "data/competition/T1",
        "standard_test_source": "data/standard_test/T1",
        "requires_hf_token": True,
    },
    "T2": {
        "name": "T2 Formal Mathematical Proof",
        "source_dir": "benchmarks/nlpcc/T2",
        "dockerfile": "tracks/shared/docker/Dockerfile.t2",
        "image": "aisb-t2:latest",
        "data_source": "data/competition/T2",
        "standard_test_source": "data/standard_test/T2",
        "requires_hf_token": False,
    },
    "T3": {
        "name": "T3 Scientific Discovery",
        "source_dir": "benchmarks/nlpcc/T3",
        "dockerfile": "tracks/shared/docker/Dockerfile.t3",
        "image": "aisb-t3:latest",
        "data_source": "data/competition/T3",
        "standard_test_source": "data/standard_test/T3",
        "requires_hf_token": False,
    },
}


@dataclass
class BenchStatus:
    track: str
    name: str
    package_exists: bool
    data_exists: bool
    dockerfile_exists: bool
    image: str
    image_exists: bool
    ready: bool
    notes: list[str]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def list_benchmarks() -> list[dict[str, Any]]:
    root = repo_root()
    return [benchmark_status(track, root).to_dict() for track in sorted(BENCHMARKS)]


def _docker_image_exists(image: str) -> bool:
    try:
        result = subprocess.run(
            ["docker", "images", "-q", image],
            capture_output=True,
            text=True,
            timeout=10,
        )
    except (OSError, subprocess.TimeoutExpired):
        return False
    return bool(result.stdout.strip())


def benchmark_status(track: str, root: Path | None = None) -> BenchStatus:
    track = track.upper()
    if track not in BENCHMARKS:
        raise ValueError(f"Unknown benchmark track: {track}")
    root = root or repo_root()
    cfg = BENCHMARKS[track]
    package_exists = (root / cfg["source_dir"] / "bench.yaml").exists()
    data_exists = (root / cfg["data_source"]).exists() or (root / cfg["standard_test_source"]).exists()
    dockerfile_exists = (root / cfg["dockerfile"]).exists()
    image_exists = _docker_image_exists(cfg["image"])
    notes: list[str] = []
    if cfg["requires_hf_token"] and not os.environ.get("HF_TOKEN"):
        notes.append("HF_TOKEN not set; gated/public-source refresh may fail, but existing local dev data can still be used.")
    if track == "T2" and not image_exists:
        notes.append("Lean4 readiness must be confirmed by building/running the Docker healthcheck on the target host.")
    ready = package_exists and data_exists and dockerfile_exists
    return BenchStatus(track, cfg["name"], package_exists, data_exists, dockerfile_exists, cfg["image"], image_exists, ready, notes)


def _copytree(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    if src.is_file():
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        return
    shutil.copytree(src, dst, dirs_exist_ok=True)


def prepare_benchmark(track: str, dest: str | Path | None = None, build_docker: bool = False) -> dict[str, Any]:
    """Prepare a participant-facing benchmark working directory."""
    track = track.upper()
    if track not in BENCHMARKS:
        raise ValueError(f"Unknown benchmark track: {track}")

    root = repo_root()
    cfg = BENCHMARKS[track]
    source = root / cfg["source_dir"]
    if not (source / "bench.yaml").exists():
        raise FileNotFoundError(f"Benchmark package is missing bench.yaml: {source}")

    dest_path = Path(dest).resolve() if dest else root / ".aisb" / "benches" / track
    dest_path.mkdir(parents=True, exist_ok=True)
    _copytree(source, dest_path)

    starter = source / "examples" / "starter_submission"
    submission = dest_path / "submission"
    if starter.exists() and not any(submission.iterdir() if submission.exists() else []):
        _copytree(starter, submission)

    competition_source = root / cfg["data_source"]
    standard_source = root / cfg["standard_test_source"]

    if competition_source.exists():
        _copytree(competition_source / "dev", dest_path / "data" / "dev")
        _copytree(competition_source / "references", dest_path / "references")
    if standard_source.exists():
        _copytree(standard_source, dest_path / "data" / "test")

    # Keep private answer files out of the default agent-visible test tree.
    private_dir = dest_path / "evaluation" / "private"
    private_dir.mkdir(parents=True, exist_ok=True)
    answer_files = {
        answer_file.resolve()
        for pattern in ("*answer*.json", "*answers*.json")
        for answer_file in (dest_path / "data" / "test").glob(pattern)
    }
    for answer_file in sorted(answer_files):
        shutil.move(str(answer_file), str(private_dir / answer_file.name))

    manifest = {
        "track": track,
        "prepared_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "source_package": str(source),
        "data_source": str(competition_source if competition_source.exists() else standard_source),
        "docker_image": cfg["image"],
        "hidden_answers_moved_to": str(private_dir),
    }
    (dest_path / ".aisb_prepare.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    docker_result: dict[str, Any] | None = None
    if build_docker:
        docker_result = build_docker_image(track)

    return {"path": str(dest_path), "manifest": manifest, "docker": docker_result}


def build_docker_image(track: str) -> dict[str, Any]:
    track = track.upper()
    if track not in BENCHMARKS:
        raise ValueError(f"Unknown benchmark track: {track}")
    root = repo_root()
    cfg = BENCHMARKS[track]
    dockerfile = root / cfg["dockerfile"]
    if not dockerfile.exists():
        raise FileNotFoundError(f"Dockerfile not found: {dockerfile}")
    cmd = ["docker", "build", "-t", cfg["image"], "-f", str(dockerfile), str(root)]
    result = subprocess.run(cmd, cwd=str(root), capture_output=True, text=True)
    return {
        "command": cmd,
        "returncode": result.returncode,
        "stdout_tail": result.stdout[-4000:],
        "stderr_tail": result.stderr[-4000:],
        "image": cfg["image"],
    }


def smoke_benchmark(track: str, backend_dir: str | Path | None = None) -> dict[str, Any]:
    """Run a local acceptance smoke test for one benchmark track."""
    from aisb.backend import create_job, run_job
    from aisb.submission import validate_submission

    track = track.upper()
    if track not in BENCHMARKS:
        raise ValueError(f"Unknown benchmark track: {track}")
    root = repo_root()
    cfg = BENCHMARKS[track]
    work_dir = root / ".aisb" / "smoke" / track
    if work_dir.exists():
        shutil.rmtree(work_dir)
    prepared = prepare_benchmark(track, dest=work_dir / "bench", build_docker=False)

    image = cfg["image"]
    if track == "T1":
        docker_cmd = [
            "docker", "run", "--rm", image,
            "python", "-c", "import numpy, pandas, sklearn; print('T1_RUNTIME_OK')",
        ]
    elif track == "T2":
        docker_cmd = [
            "docker", "run", "--rm", image,
            "bash", "-lc",
            "lean --version && lake --version && printf 'theorem t : True := by trivial\\n' > /tmp/T.lean && lean /tmp/T.lean",
        ]
    else:
        docker_cmd = [
            "docker", "run", "--rm", image,
            "python", "-c", "import numpy, pandas, sklearn, rdkit, torch; import tdc; print('T3_RUNTIME_OK')",
        ]

    docker_result = subprocess.run(docker_cmd, cwd=str(root), capture_output=True, text=True, timeout=180)
    starter = root / cfg["source_dir"] / "examples" / "starter_submission"
    validation = validate_submission(starter, strict=True)
    job = create_job(starter, track=track, backend_dir=backend_dir or (root / ".aisb" / "smoke_backend"))
    if job["state"] != "REJECTED":
        job = run_job(job["job_id"], backend_dir=backend_dir or (root / ".aisb" / "smoke_backend"), execute=False)

    return {
        "track": track,
        "prepared": prepared,
        "docker": {
            "command": docker_cmd,
            "returncode": docker_result.returncode,
            "stdout_tail": docker_result.stdout[-4000:],
            "stderr_tail": docker_result.stderr[-4000:],
        },
        "starter_validation_ok": validation["ok"],
        "starter_findings": validation["findings"],
        "backend_job": job,
        "ok": docker_result.returncode == 0 and validation["ok"] and job.get("state") == "COMPLETED",
    }


def load_bench_yaml(track: str) -> dict[str, Any]:
    cfg = BENCHMARKS[track.upper()]
    path = repo_root() / cfg["source_dir"] / "bench.yaml"
    return yaml.safe_load(path.read_text(encoding="utf-8"))
