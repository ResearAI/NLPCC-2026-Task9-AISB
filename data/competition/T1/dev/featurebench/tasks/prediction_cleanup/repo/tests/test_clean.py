from prediction_cleanup import dedupe_by_id, drop_comment_rows, normalize_prediction


def test_drop_comment_rows_removes_prefixed_ids() -> None:
    rows = [
        {"id": "# canary row", "prediction": "noop"},
        {"id": "item-1", "prediction": "A"},
        {"id": "", "prediction": "B"},
        {"id": "item-2", "prediction": "C"},
    ]
    assert drop_comment_rows(rows) == [
        {"id": "item-1", "prediction": "A"},
        {"id": "item-2", "prediction": "C"},
    ]


def test_dedupe_by_id_keeps_last_prediction_and_sorts() -> None:
    rows = [
        {"id": "b", "prediction": "first"},
        {"id": "a", "prediction": "only"},
        {"id": "b", "prediction": "last"},
    ]
    assert dedupe_by_id(rows) == [
        {"id": "a", "prediction": "only"},
        {"id": "b", "prediction": "last"},
    ]


def test_normalize_prediction_trims_lowercases_and_strips_period() -> None:
    assert normalize_prediction("  A.  ") == "a"
