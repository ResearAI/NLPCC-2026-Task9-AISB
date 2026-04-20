#!/usr/bin/env python3
"""
AISB 2026 / NLPCC — Competition Data Download Script

Downloads all required benchmark data for participants.
Handles gated datasets (requires HF_TOKEN) and public datasets automatically.

Usage:
  # Set your HuggingFace token first:
  export HF_TOKEN="hf_xxxxx"

  # Download all tracks:
  python download_competition_data.py --all

  # Download specific track:
  python download_competition_data.py --track T1
  python download_competition_data.py --track T2
  python download_competition_data.py --track T3

Legal: This script downloads data directly from original sources.
Each participant must individually accept gated dataset agreements on HuggingFace.
We do NOT redistribute gated data. See LICENSE_NOTICE.md for details.
"""
import argparse, json, os, sys, shutil
from pathlib import Path

HF_TOKEN = os.environ.get("HF_TOKEN", "")
DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "competition"


def check_hf_token():
    if not HF_TOKEN:
        print("ERROR: HF_TOKEN not set.")
        print("  1. Go to https://huggingface.co/settings/tokens")
        print("  2. Create a token with 'Read' scope")
        print("  3. export HF_TOKEN='hf_xxxxx'")
        print()
        print("You also need to accept access for these gated datasets:")
        print("  - https://huggingface.co/datasets/cais/hle")
        print("  - https://huggingface.co/datasets/gaia-benchmark/GAIA")
        print("  - https://huggingface.co/datasets/Idavidrein/gpqa")
        sys.exit(1)


def download_hf_dataset(dataset_id, config=None, split=None, output_dir=None,
                        max_samples=None, description=""):
    """Download a HuggingFace dataset to local parquet/json."""
    from datasets import load_dataset

    print(f"  Downloading {dataset_id} ({description})...")
    out = output_dir or DATA_DIR / dataset_id.replace("/", "_")
    out.mkdir(parents=True, exist_ok=True)

    kw = {"token": HF_TOKEN}
    if config:
        kw["name"] = config
    if split:
        kw["split"] = split

    try:
        ds = load_dataset(dataset_id, **kw)

        if hasattr(ds, "to_parquet"):
            # Single split
            path = out / f"{split or 'data'}.parquet"
            if max_samples:
                ds = ds.select(range(min(max_samples, len(ds))))
            ds.to_parquet(str(path))
            print(f"    Saved {len(ds)} samples to {path}")
        else:
            # DatasetDict with multiple splits
            for split_name, split_ds in ds.items():
                path = out / f"{split_name}.parquet"
                if max_samples:
                    split_ds = split_ds.select(range(min(max_samples, len(split_ds))))
                split_ds.to_parquet(str(path))
                print(f"    {split_name}: {len(split_ds)} samples -> {path}")

        # Save metadata
        meta = {"dataset_id": dataset_id, "config": config, "split": split,
                "description": description}
        (out / "metadata.json").write_text(json.dumps(meta, indent=2))
        return True

    except Exception as e:
        print(f"    ERROR: {e}")
        if "gated" in str(e).lower() or "401" in str(e):
            print(f"    -> Accept access at: https://huggingface.co/datasets/{dataset_id}")
        return False


def download_hf_parquet(dataset_id, filename, output_dir=None, description=""):
    """Download a specific parquet file directly via huggingface_hub."""
    from huggingface_hub import hf_hub_download

    print(f"  Downloading {dataset_id}/{filename} ({description})...")
    out = output_dir or DATA_DIR / dataset_id.replace("/", "_")
    out.mkdir(parents=True, exist_ok=True)

    try:
        path = hf_hub_download(dataset_id, filename, repo_type="dataset",
                               token=HF_TOKEN, local_dir=str(out))
        print(f"    Saved to {path}")
        return True
    except Exception as e:
        print(f"    ERROR: {e}")
        return False


def download_tdc(output_dir=None):
    """Download TDC ADMET data (no HF token needed)."""
    print("  Downloading TDC ADMET endpoints...")
    out = output_dir or DATA_DIR / "tdc_admet"
    out.mkdir(parents=True, exist_ok=True)

    try:
        from tdc.single_pred import ADME, Tox

        endpoints = {
            "Caco2_Wang": ADME,
            "HIA_Hou": ADME,
            "Pgp_Broccatelli": ADME,
            "Bioavailability_Ma": ADME,
            "Lipophilicity_AstraZeneca": ADME,
        }

        for name, cls in endpoints.items():
            try:
                data = cls(name=name)
                split = data.get_split(method="random", seed=42)
                for split_name, split_df in split.items():
                    path = out / f"{name}_{split_name}.csv"
                    split_df.to_csv(str(path), index=False)
                print(f"    {name}: {sum(len(v) for v in split.values())} samples")
            except Exception as e:
                print(f"    {name}: ERROR - {e}")

        return True
    except ImportError:
        print("    ERROR: pip install PyTDC")
        return False


def download_formalmath(output_dir=None):
    """Download FormalMATH from GitHub (public, no token needed)."""
    import subprocess

    print("  Cloning FormalMATH from GitHub...")
    out = output_dir or DATA_DIR / "formalmath"
    if (out / ".git").exists():
        print("    Already cloned.")
        return True

    out.mkdir(parents=True, exist_ok=True)
    try:
        subprocess.run(
            ["git", "-c", "http.sslBackend=schannel", "clone", "--depth", "1",
             "https://github.com/Sphere-AI-Lab/FormalMATH.git", str(out)],
            check=True, capture_output=True, text=True, timeout=120)
        print(f"    Cloned to {out}")
        return True
    except Exception as e:
        print(f"    ERROR: {e}")
        return False


# ============================================================
# Track definitions
# ============================================================

def download_t1(dev_only=False):
    """T1: LM Reasoning — HLE + FeatureBench + GPQA"""
    print("\n=== T1: LM Reasoning ===")
    out = DATA_DIR / "T1"
    ok = 0; total = 0

    # HLE (gated, MIT license, NO redistribution per gate terms)
    total += 1
    ok += download_hf_parquet("cais/hle", "data/test-00000-of-00001.parquet",
                              out / "hle", "HLE 2500 questions")

    # GPQA Diamond (gated, CC-BY 4.0)
    total += 1
    ok += download_hf_dataset("Idavidrein/gpqa", config="gpqa_diamond", split="train",
                              output_dir=out / "gpqa", description="GPQA Diamond 198q")

    # ZebraLogic (public)
    total += 1
    ok += download_hf_dataset("allenai/ZebraLogicBench", config="grid_mode", split="test",
                              output_dir=out / "zebralogic", description="ZebraLogic 1000 puzzles")

    print(f"\nT1: {ok}/{total} datasets downloaded")
    return ok, total


def download_t2(dev_only=False):
    """T2: Math & Proof — FormalMATH (Lean4) + ProofNet"""
    print("\n=== T2: Math & Proof ===")
    out = DATA_DIR / "T2"
    ok = 0; total = 0

    # FormalMATH (GitHub, public)
    total += 1
    ok += download_formalmath(out / "formalmath")

    # ProofNet (public HF)
    total += 1
    ok += download_hf_dataset("hoskinson-center/proofnet", split="test",
                              output_dir=out / "proofnet", description="ProofNet 186 problems")

    print(f"\nT2: {ok}/{total} datasets downloaded")
    return ok, total


def download_t3(dev_only=False):
    """T3: Scientific Discovery — TDC ADMET + Matbench Discovery"""
    print("\n=== T3: Scientific Discovery ===")
    out = DATA_DIR / "T3"
    ok = 0; total = 0

    # TDC ADMET (public, pip package)
    total += 1
    ok += download_tdc(out / "tdc_admet")

    # ScienceAgentBench (public HF)
    total += 1
    ok += download_hf_dataset("osunlp/ScienceAgentBench", split="validation",
                              output_dir=out / "scienceagentbench",
                              description="ScienceAgentBench 102 tasks")

    print(f"\nT3: {ok}/{total} datasets downloaded")
    return ok, total


def main():
    parser = argparse.ArgumentParser(description="AISB 2026 Competition Data Downloader")
    parser.add_argument("--track", choices=["T1", "T2", "T3"], help="Download specific track")
    parser.add_argument("--all", action="store_true", help="Download all tracks")
    parser.add_argument("--dev-only", action="store_true", help="Download dev split only (smaller)")
    args = parser.parse_args()

    if not args.track and not args.all:
        parser.print_help()
        sys.exit(0)

    check_hf_token()

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    total_ok = 0
    total_all = 0

    if args.all or args.track == "T1":
        ok, total = download_t1(args.dev_only)
        total_ok += ok; total_all += total

    if args.all or args.track == "T2":
        ok, total = download_t2(args.dev_only)
        total_ok += ok; total_all += total

    if args.all or args.track == "T3":
        ok, total = download_t3(args.dev_only)
        total_ok += ok; total_all += total

    print(f"\n{'='*50}")
    print(f"TOTAL: {total_ok}/{total_all} datasets downloaded successfully")
    if total_ok < total_all:
        print("Some downloads failed. Check errors above.")
    print(f"Data saved to: {DATA_DIR}")


if __name__ == "__main__":
    main()
