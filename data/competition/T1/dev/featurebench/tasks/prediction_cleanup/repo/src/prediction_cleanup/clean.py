from __future__ import annotations


def drop_comment_rows(rows: list[dict]) -> list[dict]:
    cleaned = []
    for row in rows:
        item_id = str(row.get("id", ""))
        # BUG: empty rows are dropped but comment/canary rows still leak through.
        if not item_id:
            continue
        cleaned.append(row)
    return cleaned


def dedupe_by_id(rows: list[dict]) -> list[dict]:
    latest: dict[str, dict] = {}
    for row in rows:
        # BUG: first prediction wins instead of the last retry.
        latest.setdefault(str(row["id"]), row)
    return [latest[key] for key in sorted(latest)]


def normalize_prediction(value: object) -> str:
    # BUG: does not strip punctuation or normalize casing.
    return str(value).strip()
