# AISB / NLPCC Reviewer Guide

Updated: 2026-04-22

This file describes how reviewers should read and score submissions for the public AISB / NLPCC release.

## What Reviewers Receive

For each submission, reviewers should be able to inspect:

- `paper/paper.pdf`
- `paper/claims.json`
- `logs/experiment_log.jsonl`
- `logs/iterations.jsonl`
- `results.json`
- organizer replay / evaluator summary when available

The paper is not reviewed in isolation. Claims must be checked against the evidence package.

## Reviewer Dimensions

Use these four dimensions:

- `significance` (30%)
  - Is the scientific question important?
  - Would the findings matter to the community?
- `originality` (25%)
  - Does the work provide genuinely new insight, framing, or method?
- `methodology/soundness` (25%)
  - Are the claims supported by real experiments?
  - Is the method appropriate and rigorous?
  - Are ablations, failure cases, or counter-evidence handled honestly?
- `writing/clarity` (20%)
  - Is the paper understandable, organized, and precise?

## Integrity Handling

Integrity is a gate, not a reward term.

- `CAS` below threshold => desk reject / disqualification
- hidden-answer access, canary leakage, or fabricated claims => disqualification
- if key numerical claims cannot be traced to executed experiments, the paper should not be scored as a valid scientific submission

## Track-Specific Notes

### Track A / Paper Leaderboard

- Score the paper with the rubric above.
- Treat benchmark outputs as evidence for the paper, not as a separate weighted formula term.
- For `T1`, `HLE-Verified` and `FeatureBench` help reviewers judge whether the paper's claims are supported, but they do not enter the Track A formula directly.

### Track B / Benchmark Leaderboard

- The official evaluator provides `S_benchmark`.
- Reviewers provide `S_paper` using the same four-dimension rubric.
- Final leaderboard score uses the public formula:

```text
Final_B = 0.7 * S_benchmark + 0.3 * S_paper
```

## Review Principles

- Evaluate evidence, not rhetoric.
- Do not penalize honest negative results simply because they are negative.
- Do penalize unsupported claims, vague methods, and narrative that overstates what the experiments actually show.
- If a submission is clearly not a real experimental research artifact, flag it for rejection rather than trying to salvage a high score from writing quality alone.
