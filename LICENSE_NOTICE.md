# AISB 2026 — Data License Notice

## Data Distribution Policy

AISB does NOT redistribute third-party benchmark data. All data is downloaded
directly from original sources by each participant. This is required by the
licensing terms of several gated datasets.

## Per-Dataset Licenses

| Dataset | License | Redistribution | Access |
|---------|---------|:--------------:|--------|
| cais/hle | MIT + gate terms | Prohibited by gate | Requires HF token + gate acceptance |
| gaia-benchmark/GAIA | Custom (no reshare) | Prohibited | Requires HF token + gate acceptance |
| Idavidrein/gpqa | CC-BY 4.0 + gate terms | Restricted | Requires HF token + gate acceptance |
| lmms-lab/VideoMMMU | Unstated (3rd-party video) | Prohibited | Requires HF token |
| allenai/asta-bench | Custom Ai2 License | Prohibited | Requires HF token + gate acceptance |
| EdisonScientific/labbench2 | CC-BY-SA 4.0 | Permitted (with attribution) | Requires HF token |
| TDC ADMET | CC-BY 4.0 | Permitted | `pip install PyTDC` |
| FormalMATH | Public (GitHub) | Permitted | `git clone` |
| hoskinson-center/proofnet | MIT | Permitted | Public HF dataset |
| allenai/ZebraLogicBench | Apache 2.0 | Permitted | Public HF dataset |

## Participant Requirements

1. Create a HuggingFace account at https://huggingface.co
2. Accept gated access for required datasets (links in download script)
3. Set `HF_TOKEN` environment variable
4. Run `python scripts/download_competition_data.py --all`

## Legal Basis

Following the precedent set by:
- **HAL (Princeton)**: Requires per-user HF authentication, never redistributes GAIA
- **ARC Prize**: Holds private test sets centrally, never distributes to participants
- **NLPCC shared tasks**: Link to original data sources, distribute only purpose-built data
