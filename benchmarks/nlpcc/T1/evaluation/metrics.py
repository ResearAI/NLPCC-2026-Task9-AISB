"""T1 metrics."""
from __future__ import annotations

import re


def normalize_answer(text: object) -> str:
    value = str(text).strip().rstrip(".").lower()
    match = re.match(r"^([a-e])[\.\)\s:]", value)
    if match:
        return match.group(1)
    return value


def exact_match_accuracy(predictions: list[dict], answers: list[dict]) -> float:
    answer_map = {item["id"]: normalize_answer(item.get("answer", "")) for item in answers}
    if not answer_map:
        return 0.0
    correct = 0
    for item in predictions:
        if normalize_answer(item.get("prediction", "")) == answer_map.get(item.get("id"), ""):
            correct += 1
    return correct / len(answer_map)


def pass_rate(results: list[dict]) -> float:
    if not results:
        return 0.0
    return sum(1 for item in results if str(item.get("result", "")).lower() == "pass") / len(results)
