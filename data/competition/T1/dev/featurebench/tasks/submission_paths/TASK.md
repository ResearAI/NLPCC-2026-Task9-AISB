# Task: Submission Paths

Goal: finish the local path/config helpers used by an AI Scientist workspace.

Requirements:

- `resolve_output_paths()` must sanitize the team name and create deterministic
  folder names for `submission`, `logs`, and `paper`.
- `deep_merge()` must merge nested dictionaries instead of replacing them
  wholesale.
- Do not modify tests.

Success criterion:

- `python -m pytest tests -q` passes in this repo.
