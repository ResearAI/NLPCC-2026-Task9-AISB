# Task: Run Report Summary

Goal: make the local report helpers usable for an AI Scientist workflow.

Requirements:

- Fix `build_summary(records)` so it computes stable aggregate statistics.
- Fix `markdown_table(records)` so it renders a deterministic markdown table.
- Do not modify tests.

Success criterion:

- `python -m pytest tests -q` passes in this repo.
