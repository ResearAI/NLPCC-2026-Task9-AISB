"""T3 metrics."""
from __future__ import annotations

import math


def mae(y_true: list[float], y_pred: list[float]) -> float:
    if not y_true:
        return 0.0
    return sum(abs(a - b) for a, b in zip(y_true, y_pred)) / len(y_true)


def accuracy(y_true: list[float], y_pred: list[float]) -> float:
    if not y_true:
        return 0.0
    return sum(1 for a, b in zip(y_true, y_pred) if int(round(a)) == int(round(b))) / len(y_true)


def normalized_regression_score(value: float) -> float:
    if math.isnan(value) or math.isinf(value):
        return 0.0
    return 1.0 / (1.0 + max(value, 0.0))
