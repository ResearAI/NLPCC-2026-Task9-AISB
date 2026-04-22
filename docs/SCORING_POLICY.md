# AISB / NLPCC Public Scoring Policy

Updated: 2026-04-22

This file is the public source of truth for leaderboard scoring. If another public document conflicts with this file, follow this file.

## Leaderboard Structure

- `Track A` / `paper` = Paper Leaderboard
- `Track B` / `benchmark` = Benchmark Leaderboard
- `T1`, `T2`, `T3` are benchmark directions, not score-mixture tracks

Legacy `A` / `B` values may still appear in older starter packages, but new submissions should set `metadata.json.track` to `paper` or `benchmark`.

## Track A / Paper Leaderboard

The paper leaderboard is reviewer-led.

- Final paper-track score:

```text
Final_A = 0.0 * S_benchmark + 1.0 * S_paper
```

- `S_paper` is derived from reviewer scores:

```text
S_paper = 0.30 * significance
        + 0.25 * originality
        + 0.25 * methodology/soundness
        + 0.20 * writing/clarity
```

- Reviews are produced by 2-3 reviewers.
- Reviewers are given the paper plus integrity/evidence materials, including `paper/claims.json`, `logs/experiment_log.jsonl`, `logs/iterations.jsonl`, and organizer replay summaries when available.
- Benchmark outputs in Track A are evidence for the paper. They support reviewer judgment but are not linearly added to the Track A score.

For `T1`, `HLE-Verified` and `FeatureBench` results are treated as experimental evidence in Track A, not as a fixed weighted benchmark term.

## Track B / Benchmark Leaderboard

The benchmark leaderboard combines verified benchmark improvement with paper/research quality.

- Final benchmark-track score:

```text
Final_B = 0.7 * S_benchmark + 0.3 * S_paper
```

- `S_benchmark` comes from the official evaluator for the chosen direction.
- `S_paper` uses the same reviewer rubric as Track A.
- In Track B, the paper is still required. It explains why the method works, what was tried, what failed, and why the reported benchmark improvement should be trusted.

## Integrity Gate

Integrity checks are not a bonus term. They are a gate.

- `CAS` below threshold => desk reject / disqualification
- hidden-answer access or canary leakage => disqualification
- fabricated claims or untraceable key numbers => disqualification
- organizer-side replay may be used to confirm executable evidence and official scores

Structured CAS is computed from `paper/claims.json` against `logs/experiment_log.jsonl`.

## Reviewer Guidance Summary

Reviewers should evaluate:

- `significance`: importance and research value
- `originality`: novelty of insight or method
- `methodology/soundness`: rigor, evidence quality, and whether claims are actually supported
- `writing/clarity`: clarity of presentation and scientific communication

Reviewers should not reward polished writing when claims are unsupported by executed experiments.

Honest negative results should not be penalized for honesty alone.

## Notes

- This public scoring policy supersedes older public formulas such as `Dual Score = 0.4 * PQS + 0.3 * CAS + 0.2 * BI + 0.1 * ESR`.
- Security and integrity checks still matter deeply, but they should not be confused with the public leaderboard formula.
