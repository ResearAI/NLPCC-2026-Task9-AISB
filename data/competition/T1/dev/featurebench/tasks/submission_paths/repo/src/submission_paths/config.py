from __future__ import annotations


def deep_merge(base: dict, override: dict) -> dict:
    merged = dict(base)
    for key, value in override.items():
        # BUG: nested dicts are replaced wholesale instead of merged.
        merged[key] = value
    return merged
