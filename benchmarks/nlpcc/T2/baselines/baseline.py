#!/usr/bin/env python3
"""Runnable T2 baselines with real Lean checks.

Modes:
- deterministic: small tactic router, fully local and reproducible.
- novita: DeepSeek-Prover-V2 candidate generation through the Novita OpenAI-compatible API,
  followed by local Lean verification. The API key is read from NOVITA_API_KEY.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

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


def bench_dir() -> Path:
    value = os.environ.get("AISB_BENCH_DIR")
    if value:
        return Path(value).resolve()
    return Path(__file__).resolve().parents[1]


def default_data_path(bench: Path) -> Path:
    packaged = bench / "data" / "dev" / "formalmath_dev.json"
    if packaged.exists():
        return packaged
    return Path(__file__).resolve().parents[4] / "data" / "competition" / "T2" / "dev" / "formalmath_dev.json"


def load_items(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        return []
    rows = []
    for item in data:
        if not isinstance(item, dict):
            continue
        if str(item.get("theorem_names") or item.get("id") or "").startswith("#"):
            continue
        rows.append(item)
    return rows


def run_lean(code: str, timeout: int = 10) -> dict:
    with tempfile.TemporaryDirectory(prefix="aisb_t2_baseline_") as tmp:
        work = Path(tmp)
        candidate = work / "Candidate.lean"
        candidate.write_text(code, encoding="utf-8")
        (work / "lakefile.lean").write_text(LAKEFILE, encoding="utf-8")
        (work / "lean-toolchain").write_text(TOOLCHAIN, encoding="utf-8")
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
        try:
            result = subprocess.run(cmd, cwd=run_cwd, capture_output=True, text=True, timeout=timeout)
            verified = result.returncode == 0 and "declaration uses 'sorry'" not in result.stderr
            return {
                "verified": verified,
                "stderr": result.stderr[-2000:],
                "stdout": result.stdout[-2000:],
            }
        except (OSError, subprocess.TimeoutExpired) as exc:
            return {"verified": False, "stderr": str(exc), "stdout": ""}


def theorem_header(autoformalization: str) -> str:
    idx = autoformalization.rfind(":= by")
    if idx >= 0:
        return autoformalization[:idx + 5]
    idx = autoformalization.rfind(" by")
    if idx >= 0:
        return autoformalization[:idx + 3]
    return autoformalization


def assemble(autoformalization: str, proof: str) -> str:
    return theorem_header(autoformalization) + "\n  " + proof.strip().replace("\n", "\n  ") + "\n"


def normalize_imports(code: str, autoformalization: str) -> str:
    """Use the organizer-provided import preamble for generated full files.

    Hosted provers often emit narrow Mathlib imports. The official tasks already
    provide a known-good preamble, so the baseline normalizes generated files to
    that preamble before Lean verification.
    """
    if not code.lstrip().startswith("import "):
        return code
    preamble = [line for line in autoformalization.splitlines() if line.startswith("import ")]
    if not preamble:
        preamble = ["import Mathlib"]
    lines = code.splitlines()
    idx = 0
    while idx < len(lines) and (lines[idx].startswith("import ") or not lines[idx].strip()):
        idx += 1
    return "\n".join([*preamble, "", *lines[idx:]]).strip() + "\n"


def extract_lean_candidate(text: str, autoformalization: str) -> str:
    cleaned = text.strip()
    if "```" in cleaned:
        parts = cleaned.split("```")
        for part in parts:
            body = part.strip()
            if body.startswith("lean"):
                body = body[4:].strip()
            if "theorem " in body or "import Mathlib" in body:
                cleaned = body
                break
    if "theorem " in cleaned or "import Mathlib" in cleaned:
        return normalize_imports(cleaned, autoformalization)
    return assemble(autoformalization, cleaned)


def novita_messages(item: dict) -> list[dict]:
    autoformalization = str(item.get("autoformalization") or "")
    statement = str(item.get("refined_statement") or "")
    solution = str(item.get("solution") or "")
    return [
        {
            "role": "system",
            "content": (
                "You are DeepSeek-Prover-V2 generating Lean 4 proofs. "
                "Return only a complete Lean 4 file or a proof body. "
                "Do not use sorry, admit, axiom, or unsafe declarations."
            ),
        },
        {
            "role": "user",
            "content": (
                "Complete the following Lean theorem under Mathlib. "
                "The verifier uses Lean 4.15.0 and Mathlib v4.15.0.\n\n"
                f"Natural-language statement:\n{statement}\n\n"
                f"Informal solution hint:\n{solution}\n\n"
                f"Lean prefix:\n{autoformalization}\n"
            ),
        },
    ]


def novita_repair_messages(item: dict, previous_code: str, lean_diagnostics: str) -> list[dict]:
    autoformalization = str(item.get("autoformalization") or "")
    statement = str(item.get("refined_statement") or "")
    solution = str(item.get("solution") or "")
    return [
        {
            "role": "system",
            "content": (
                "You are DeepSeek-Prover-V2 repairing Lean 4 proofs. "
                "Return only a complete Lean 4 file. "
                "Do not use sorry, admit, axiom, or unsafe declarations."
            ),
        },
        {
            "role": "user",
            "content": (
                "The previous Lean proof failed under Lean 4.15.0 and Mathlib v4.15.0. "
                "Repair it so the verifier accepts the file.\n\n"
                f"Natural-language statement:\n{statement}\n\n"
                f"Informal solution hint:\n{solution}\n\n"
                f"Required Lean theorem prefix:\n{autoformalization}\n\n"
                f"Previous Lean file:\n```lean\n{previous_code}\n```\n\n"
                f"Lean diagnostics:\n{lean_diagnostics[-4000:]}\n"
            ),
        },
    ]


def call_novita(messages: list[dict], model: str, max_tokens: int, temperature: float, timeout: int) -> str:
    api_key = os.environ.get("NOVITA_API_KEY")
    if not api_key:
        raise RuntimeError("NOVITA_API_KEY is not set")
    base_url = os.environ.get("NOVITA_BASE_URL", "https://api.novita.ai/openai").rstrip("/")
    proxy_url = os.environ.get("NOVITA_PROXY") or os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
    payload = json.dumps(
        {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "curl/8.0.0",
        },
        method="POST",
    )
    try:
        if proxy_url:
            opener = urllib.request.build_opener(
                urllib.request.ProxyHandler({"http": proxy_url, "https": proxy_url})
            )
            response_ctx = opener.open(request, timeout=timeout)
        else:
            response_ctx = urllib.request.urlopen(request, timeout=timeout)
        with response_ctx as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")[-2000:]
        raise RuntimeError(f"Novita HTTP {exc.code}: {body}") from exc
    return str(data["choices"][0]["message"]["content"])


def route_candidates(item: dict) -> list[str]:
    domain = str(item.get("domain") or "").lower()
    theorem_name = str(item.get("theorem_names") or "").lower()
    header = str(item.get("autoformalization") or "").lower()
    candidates: list[str] = []

    if "↔" in header or " iff " in header:
        candidates.extend(["constructor <;> aesop", "tauto", "aesop"])
    if "∃" in header or "exists" in header:
        candidates.extend(["aesop", "constructor <;> aesop"])
    if "number theory" in domain or "dvd" in header or "%" in header or "mod" in header:
        candidates.extend(["omega", "norm_num", "aesop"])
    if "inequal" in domain or "analysis" in domain or ">" in header or "<" in header or "≤" in header or "≥" in header:
        candidates.extend(["nlinarith", "linarith", "positivity\n  nlinarith", "omega"])
    if "algebra" in domain or "^" in header or "ring" in theorem_name:
        candidates.extend(["ring_nf", "ring", "nlinarith"])
    if "discrete mathematics" in domain or "combin" in domain or "finset" in header:
        candidates.extend(["aesop", "simp", "omega"])
    candidates.extend([
        "simp_all",
        "aesop",
        "simp",
        "norm_num",
        "omega",
        "linarith",
    ])

    seen: set[str] = set()
    ordered = []
    for cand in candidates:
        if cand not in seen:
            seen.add(cand)
            ordered.append(cand)
    return ordered[:3]


def solve(item: dict, timeout: int) -> dict:
    autoformalization = str(item.get("autoformalization") or "")
    for proof in route_candidates(item):
        result = run_lean(assemble(autoformalization, proof), timeout=timeout)
        if result["verified"]:
            return {
                "id": str(item.get("theorem_names") or item.get("id") or ""),
                "proof": proof,
                "lean_code": assemble(autoformalization, proof),
                "verified": True,
            }
    return {
        "id": str(item.get("theorem_names") or item.get("id") or ""),
        "proof": "aesop",
        "lean_code": assemble(autoformalization, "aesop"),
        "verified": False,
    }


def solve_novita(item: dict, timeout: int, model: str, max_tokens: int, temperature: float, samples: int) -> dict:
    theorem_id = str(item.get("theorem_names") or item.get("id") or "")
    autoformalization = str(item.get("autoformalization") or "")
    attempts = []
    last_content = ""
    last_lean_code = autoformalization
    messages = novita_messages(item)
    for sample_idx in range(samples):
        try:
            content = call_novita(
                messages,
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                timeout=timeout,
            )
            lean_code = extract_lean_candidate(content, autoformalization)
            last_content = content
            last_lean_code = lean_code
            checked = run_lean(lean_code, timeout=timeout)
            attempts.append(
                {
                    "sample": sample_idx + 1,
                    "mode": "initial" if sample_idx == 0 else "repair",
                    "verified": checked["verified"],
                    "stderr": checked.get("stderr", "")[-1000:],
                    "stdout": checked.get("stdout", "")[-1000:],
                    "error": checked.get("error", "")[-1000:],
                }
            )
            if checked["verified"]:
                return {
                    "id": theorem_id,
                    "proof": content,
                    "lean_code": lean_code,
                    "verified": True,
                    "provider": "novita",
                    "model": model,
                    "temperature": temperature,
                    "attempts": attempts,
                }
            diagnostics = "\n".join(
                part for part in [checked.get("stderr", ""), checked.get("stdout", ""), checked.get("error", "")]
                if part
            )
            if diagnostics:
                messages = novita_repair_messages(item, lean_code, diagnostics)
        except Exception as exc:  # noqa: BLE001 - baseline should log provider failures.
            attempts.append({"sample": sample_idx + 1, "verified": False, "error": str(exc)[-1000:]})
            time.sleep(min(sample_idx + 1, 3))
    return {
        "id": theorem_id,
        "proof": last_content,
        "lean_code": last_lean_code,
        "verified": False,
        "provider": "novita",
        "model": model,
        "temperature": temperature,
        "attempts": attempts,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="AISB T2 baselines")
    parser.add_argument("--input", help="Override theorem JSON path")
    parser.add_argument("--output", default="submission/proofs.json")
    parser.add_argument("--max-items", type=int, default=50)
    parser.add_argument("--timeout", type=int, default=10)
    parser.add_argument("--provider", choices=["deterministic", "novita"], default="deterministic")
    parser.add_argument("--model", default="deepseek/deepseek-prover-v2-671b")
    parser.add_argument("--temperature", type=float, default=1.0)
    parser.add_argument("--max-tokens", type=int, default=160000)
    parser.add_argument("--samples", type=int, default=1)
    args = parser.parse_args(argv)

    bench = bench_dir()
    data_path = Path(args.input).resolve() if args.input else default_data_path(bench)
    items = load_items(data_path)
    if args.max_items > 0:
        items = items[: args.max_items]

    if args.provider == "novita":
        proofs = [
            solve_novita(
                item,
                timeout=args.timeout,
                model=args.model,
                max_tokens=args.max_tokens,
                temperature=args.temperature,
                samples=max(args.samples, 1),
            )
            for item in items
        ]
    else:
        proofs = [solve(item, timeout=args.timeout) for item in items]
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(proofs, indent=2, ensure_ascii=False), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
