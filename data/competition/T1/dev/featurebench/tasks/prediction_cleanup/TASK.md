# Task: Prediction Cleanup

Goal: make the prediction export helpers safe for backend replay.

Requirements:

- Remove comment/canary rows before export.
- Keep only the final prediction for each `id`.
- Normalize the final prediction string.

Success criterion:

- `python -m pytest tests -q` passes in this repo.
