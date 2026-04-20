#!/usr/bin/env python3
"""Run AI Scientist v2 across AISB/NLPCC directions, tracks, and rounds.

This is a real runner, not a fixture copier: each job invokes
AI-Scientist-v2's BFTS launcher with an isolated config and output directory.
The default knobs are intentionally shallow so the full 3 x 2 x 2 matrix is
usable as an integration trial before committing to a multi-hour full run.
"""
from __future__ import annotations

import argparse
import concurrent.futures as futures
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
AISV2_ROOT = ROOT / "ai_scientists" / "ai_scientist_v2" / "AI-Scientist-v2"
LAUNCH = AISV2_ROOT / "launch_scientist_bfts.py"
DEFAULT_MODEL = "openrouter/z-ai/glm-5.1"


IDEAS: dict[str, dict[str, list[dict[str, Any]]]] = {
    "T1": {
        "A": [{
            "Name": "hle_research_discovery",
            "Title": "Reasoning Failure Taxonomy for Expert Scientific Questions",
            "Short Hypothesis": "Expert-level scientific reasoning failures can be reduced by domain-aware answer verification and error taxonomy feedback.",
            "Related Work": "Humanity's Last Exam, chain-of-thought prompting, self-consistency, answer verification.",
            "Abstract": "This run studies failure categories on hard AI/CS reasoning questions and tests a verification-oriented prompting strategy.",
            "Experiments": [
                "Load available AISB/NLPCC T1 development examples.",
                "Build a direct-answer baseline with logged rationales.",
                "Classify errors into retrieval, calculation, ambiguity, and reasoning categories.",
                "Test a verification pass that checks answer format and consistency.",
            ],
            "Risk Factors and Limitations": [
                "Small development samples may not cover all expert domains.",
                "Prompt-only improvements may not transfer to hidden tests.",
            ],
        }],
        "B": [{
            "Name": "hle_accuracy_improvement",
            "Title": "Adaptive Multi-Strategy Prompting for T1 HLE-Style Questions",
            "Short Hypothesis": "Routing questions by domain and applying domain-specific verification can improve exact-match accuracy over direct prompting.",
            "Related Work": "HLE, DeepSeek-R1 reasoning, self-consistency, domain routing.",
            "Abstract": "This run optimizes an adaptive answer pipeline for HLE-style AI/CS reasoning tasks.",
            "Experiments": [
                "Create a direct prompting baseline.",
                "Implement a lightweight domain router.",
                "Compare direct, chain-of-thought, and verification prompts.",
                "Report cost and failure modes for each strategy.",
            ],
            "Risk Factors and Limitations": [
                "Routing mistakes can harm performance.",
                "Multiple passes increase token cost.",
            ],
        }],
    },
    "T2": {
        "A": [{
            "Name": "formal_proof_strategy_discovery",
            "Title": "Lean 4 Proof Failure Taxonomy for FormalMATH",
            "Short Hypothesis": "Theorem-shape classification plus tactic templates can reduce common Lean proof failures.",
            "Related Work": "FormalMATH, Lean 4, theorem proving with language models, tactic repair.",
            "Abstract": "This run studies Lean proof failures and tests whether structured tactic routing improves proof completion.",
            "Experiments": [
                "Load available FormalMATH development examples.",
                "Generate one-shot Lean proof attempts for simple theorem classes.",
                "Categorize compiler failures by syntax, unknown identifier, type mismatch, and unsolved goals.",
                "Test targeted repair prompts based on compiler feedback.",
            ],
            "Risk Factors and Limitations": [
                "Lean import context may dominate failure rates.",
                "Development subset success may not generalize.",
            ],
        }],
        "B": [{
            "Name": "formalmath_proof_rate_improvement",
            "Title": "Error-Guided Lean 4 Repair Loops for FormalMATH",
            "Short Hypothesis": "Compiler-feedback repair loops can improve proof rate over one-shot generation for FormalMATH problems.",
            "Related Work": "Lean 4, compiler-feedback repair, neural theorem proving.",
            "Abstract": "This run evaluates whether iterative Lean diagnostics can guide proof repair and improve completion rate.",
            "Experiments": [
                "Run one-shot proof generation baseline on available examples.",
                "Execute Lean verification for candidate proofs.",
                "Apply one or more error-guided repair rounds.",
                "Measure solved proofs, error families, and runtime cost.",
            ],
            "Risk Factors and Limitations": [
                "Hard theorems may need library search beyond prompt repair.",
                "Repair loops increase runtime and API usage.",
            ],
        }],
    },
    "T3": {
        "A": [{
            "Name": "admet_feature_discovery",
            "Title": "Molecular Representation Discovery for ADMET Prediction",
            "Short Hypothesis": "Endpoint-specific combinations of fingerprints and descriptors outperform a single shared molecular representation.",
            "Related Work": "TDC ADMET, Morgan fingerprints, RDKit descriptors, feature selection.",
            "Abstract": "This run compares molecular representations for ADMET endpoints and analyzes where feature families help.",
            "Experiments": [
                "Train a simple baseline on available ADMET development data.",
                "Compare Morgan fingerprint sizes and radii.",
                "Add RDKit descriptors when feasible.",
                "Run endpoint-level ablations and summarize improvements.",
            ],
            "Risk Factors and Limitations": [
                "Feature engineering may overfit small endpoints.",
                "Descriptor failures can occur for malformed SMILES.",
            ],
        }],
        "B": [{
            "Name": "admet_sota_improvement",
            "Title": "Ensemble Molecular Models for T3 ADMET Challenge",
            "Short Hypothesis": "A small ensemble over diverse fingerprints can improve ADMET prediction robustness versus a single model.",
            "Related Work": "TDC, XGBoost, LightGBM, RandomForest, molecular fingerprints.",
            "Abstract": "This run tests whether ensemble modeling with diverse molecular features improves ADMET challenge metrics.",
            "Experiments": [
                "Build a RandomForest or gradient boosting baseline.",
                "Train models on multiple fingerprint configurations.",
                "Compare per-endpoint validation metrics.",
                "Test a simple ensemble or model-selection strategy.",
            ],
            "Risk Factors and Limitations": [
                "Hyperparameter search may exceed runtime budget.",
                "Ensemble gains may be small relative to complexity.",
            ],
        }],
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default=".aisb/aisv2_matrix")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--directions", nargs="+", default=["T1", "T2", "T3"])
    parser.add_argument("--tracks", nargs="+", default=["A", "B"])
    parser.add_argument("--rounds", type=int, default=2)
    parser.add_argument("--parallel", type=int, default=3)
    parser.add_argument("--timeout-sec", type=int, default=1800)
    parser.add_argument(
        "--wall-timeout-sec",
        type=int,
        default=2400,
        help="Total wall-clock timeout for one AI Scientist v2 launcher process.",
    )
    parser.add_argument("--stage-iters", type=int, default=1)
    parser.add_argument("--steps", type=int, default=1)
    parser.add_argument("--skip-writeup", action="store_true")
    parser.add_argument("--skip-review", action="store_true", default=True)
    parser.add_argument("--aggregate-plots", action="store_true")
    parser.add_argument("--generate-report", action="store_true")
    parser.add_argument("--num-cite-rounds", type=int, default=2)
    return parser.parse_args()


def load_openrouter_key(env: dict[str, str]) -> None:
    if env.get("OPENROUTER_API_KEY"):
        return
    key_file = ROOT / "Openrouter_api_key.txt"
    if key_file.exists():
        key = key_file.read_text(encoding="utf-8-sig").strip()
        if key:
            env["OPENROUTER_API_KEY"] = key


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def analyze_run_logs(run_dir: Path) -> dict[str, Any]:
    stdout_text = (run_dir / "stdout.log").read_text(encoding="utf-8", errors="replace") if (run_dir / "stdout.log").exists() else ""
    stderr_text = (run_dir / "stderr.log").read_text(encoding="utf-8", errors="replace") if (run_dir / "stderr.log").exists() else ""
    metrics = [line.strip() for line in stdout_text.splitlines() if line.strip().startswith("Metrics(")]
    return {
        "added_result_nodes": stdout_text.count("Added result node to journal"),
        "selected_best_node": "Selected node" in stdout_text,
        "no_best_node": "No best node found" in stdout_text,
        "did_not_find_working_implementation": "did not find a working implementation" in stdout_text,
        "experiment_ended": "Experiment ended" in stdout_text,
        "multi_seed_eval_done": "multi-seed eval done" in stdout_text,
        "traceback": "Traceback" in stderr_text,
        "smiles_warnings": stderr_text.count("SMILES Parse Error") + stderr_text.count("Explicit valence"),
        "metric_tail": metrics[-1] if metrics else "",
    }


def make_config(direction: str, track: str, run_dir: Path, args: argparse.Namespace) -> dict[str, Any]:
    data_dir = ROOT / ".aisb" / "benches" / direction / "data"
    if not data_dir.exists():
        data_dir = ROOT / "data" / "standard_test" / direction
    return {
        "data_dir": str(data_dir),
        "preprocess_data": False,
        "goal": IDEAS[direction][track][0]["Short Hypothesis"],
        "eval": None,
        "log_dir": str(run_dir / "logs"),
        "workspace_dir": str(run_dir / "workspaces"),
        "copy_data": True,
        "exp_name": f"aisb_{direction}_{track}_{run_dir.name}",
        "exec": {
            "timeout": args.timeout_sec,
            "agent_file_name": "runfile.py",
            "format_tb_ipython": False,
        },
        "generate_report": bool(args.generate_report),
        "report": {"model": args.model, "temp": 0.7},
        "experiment": {"num_syn_datasets": 1},
        "debug": {"stage4": False},
        "agent": {
            "type": "parallel",
            "num_workers": 1,
            "stages": {
                "stage1_max_iters": args.stage_iters,
                "stage2_max_iters": args.stage_iters,
                "stage3_max_iters": args.stage_iters,
                "stage4_max_iters": args.stage_iters,
            },
            "steps": args.steps,
            "k_fold_validation": 1,
            "multi_seed_eval": {"num_seeds": 1},
            "expose_prediction": False,
            "data_preview": True,
            "code": {"model": args.model, "temp": 0.7, "max_tokens": 12000},
            "feedback": {"model": args.model, "temp": 0.3, "max_tokens": 8192},
            "vlm_feedback": {"model": args.model, "temp": 0.3, "max_tokens": None},
            "summary": {"model": args.model, "temp": 0.3, "max_tokens": 8192},
            "select_node": {"model": args.model, "temp": 0.3, "max_tokens": 8192},
            "search": {"max_debug_depth": 1, "debug_prob": 0.0, "num_drafts": 1},
        },
    }


def run_one(direction: str, track: str, round_idx: int, args: argparse.Namespace) -> dict[str, Any]:
    started = time.time()
    run_dir = (ROOT / args.output_dir / direction / f"track_{track}" / f"round_{round_idx}").resolve()
    run_dir.mkdir(parents=True, exist_ok=True)
    idea = dict(IDEAS[direction][track][0])
    idea["Name"] = f"{idea['Name']}_round_{round_idx}"
    idea["Round"] = round_idx

    ideas_path = run_dir / "ideas.json"
    config_path = run_dir / "bfts_config.yaml"
    write_json(ideas_path, [idea])
    config_path.write_text(yaml.safe_dump(make_config(direction, track, run_dir, args), sort_keys=False), encoding="utf-8")

    env = dict(os.environ)
    load_openrouter_key(env)
    env["PYTHONPATH"] = str(AISV2_ROOT) + os.pathsep + env.get("PYTHONPATH", "")
    env["CUDA_VISIBLE_DEVICES"] = ""
    env["AI_SCIENTIST_GLOBAL_PROCESS_CLEANUP"] = "0"
    env["AI_SCIENTIST_REPL_START_TIMEOUT"] = "60"
    env["AISB_NO_TORCH"] = "1"
    env.setdefault("OPENAI_API_KEY", env.get("OPENROUTER_API_KEY", ""))

    cmd = [
        sys.executable,
        str(LAUNCH),
        "--config", str(config_path),
        "--load_ideas", str(ideas_path),
        "--idea_idx", "0",
        "--attempt_id", str(round_idx),
        "--writeup-type", "icbinb",
        "--writeup-retries", "1",
        "--num_cite_rounds", str(args.num_cite_rounds),
        "--model_agg_plots", args.model,
        "--model_writeup", args.model,
        "--model_citation", args.model,
        "--model_writeup_small", args.model,
        "--model_review", args.model,
    ]
    if args.skip_writeup:
        cmd.append("--skip_writeup")
    if args.skip_review:
        cmd.append("--skip_review")
    if not args.aggregate_plots:
        cmd.append("--skip_aggregate_plots")

    result: dict[str, Any] = {
        "direction": direction,
        "track": track,
        "round": round_idx,
        "run_dir": str(run_dir),
        "model": args.model,
        "cmd": [c if "KEY" not in c else "<redacted>" for c in cmd],
        "started_at": datetime.now().isoformat(),
    }
    stdout_path = run_dir / "stdout.log"
    stderr_path = run_dir / "stderr.log"
    try:
        with stdout_path.open("w", encoding="utf-8", errors="replace") as stdout, stderr_path.open("w", encoding="utf-8", errors="replace") as stderr:
            proc = subprocess.Popen(
                cmd,
                cwd=str(AISV2_ROOT),
                env=env,
                stdout=stdout,
                stderr=stderr,
                text=True,
            )
            try:
                returncode = proc.wait(timeout=args.wall_timeout_sec)
            except subprocess.TimeoutExpired:
                if os.name == "nt":
                    subprocess.run(
                        ["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                else:
                    proc.kill()
                raise
        stdout_text = stdout_path.read_text(encoding="utf-8", errors="replace") if stdout_path.exists() else ""
        stderr_text = stderr_path.read_text(encoding="utf-8", errors="replace") if stderr_path.exists() else ""
        result["returncode"] = returncode
        result["status"] = "completed" if returncode == 0 else "failed"
        result["stdout_tail"] = stdout_text[-4000:]
        result["stderr_tail"] = stderr_text[-4000:]
    except subprocess.TimeoutExpired:
        stdout_text = stdout_path.read_text(encoding="utf-8", errors="replace") if stdout_path.exists() else ""
        stderr_text = stderr_path.read_text(encoding="utf-8", errors="replace") if stderr_path.exists() else ""
        result["returncode"] = None
        result["status"] = "timeout"
        result["stdout_tail"] = stdout_text[-4000:]
        result["stderr_tail"] = stderr_text[-4000:]
    except Exception as exc:
        result["returncode"] = None
        result["status"] = "error"
        result["error"] = repr(exc)

    result["elapsed_seconds"] = round(time.time() - started, 2)
    result["paper_candidates"] = [str(path) for path in run_dir.rglob("*.pdf")]
    result["token_trackers"] = [str(path) for path in run_dir.rglob("token_tracker.json")]
    result["log_analysis"] = analyze_run_logs(run_dir)
    write_json(run_dir / "run_result.json", result)
    return result


def main() -> int:
    args = parse_args()
    output_dir = ROOT / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    jobs = [
        (direction.upper(), track.upper(), round_idx)
        for direction in args.directions
        for track in args.tracks
        for round_idx in range(1, args.rounds + 1)
    ]
    summary: dict[str, Any] = {
        "started_at": datetime.now().isoformat(),
        "model": args.model,
        "jobs": [],
        "output_dir": str(output_dir.resolve()),
    }
    write_json(output_dir / "matrix_summary.json", summary)

    with futures.ThreadPoolExecutor(max_workers=max(1, args.parallel)) as executor:
        future_map = {
            executor.submit(run_one, direction, track, round_idx, args): (direction, track, round_idx)
            for direction, track, round_idx in jobs
        }
        for future in futures.as_completed(future_map):
            result = future.result()
            summary["jobs"].append(result)
            summary["updated_at"] = datetime.now().isoformat()
            write_json(output_dir / "matrix_summary.json", summary)
            print(f"{result['direction']}/{result['track']}/round_{result['round']}: {result['status']} ({result['elapsed_seconds']}s)")

    status_counts: dict[str, int] = {}
    for job in summary["jobs"]:
        status_counts[job["status"]] = status_counts.get(job["status"], 0) + 1
    summary["status_counts"] = status_counts
    summary["completed_at"] = datetime.now().isoformat()
    write_json(output_dir / "matrix_summary.json", summary)
    parsed_report = [
        {
            "direction": job["direction"],
            "track": job["track"],
            "round": job["round"],
            "status": job["status"],
            "elapsed_seconds": job["elapsed_seconds"],
            **job.get("log_analysis", {}),
        }
        for job in sorted(summary["jobs"], key=lambda item: (item["direction"], item["track"], item["round"]))
    ]
    write_json(output_dir / "parsed_report.json", parsed_report)
    return 0 if status_counts.get("completed", 0) == len(jobs) else 1


if __name__ == "__main__":
    raise SystemExit(main())
