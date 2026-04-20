from run_report import RunRecord, build_summary, markdown_table


def test_build_summary_counts_only_success_for_mean() -> None:
    records = [
        RunRecord("r3", 0.3, "FAILED", "syntax"),
        RunRecord("r1", 0.7, "SUCCESS", "kept"),
        RunRecord("r2", 0.9, "SUCCESS", "best"),
    ]
    summary = build_summary(records)
    assert summary == {
        "count": 3,
        "success_count": 2,
        "mean_score": 0.8,
        "best_run_id": "r2",
    }


def test_markdown_table_is_sorted_and_formatted() -> None:
    records = [
        RunRecord("b", 0.7, "SUCCESS", "kept"),
        RunRecord("a", 0.7, "FAILED", "timeout"),
        RunRecord("c", 0.9, "SUCCESS", "best"),
    ]
    table = markdown_table(records)
    lines = table.splitlines()
    assert lines[0] == "| run_id | status | score | notes |"
    assert lines[1] == "| --- | --- | ---: | --- |"
    assert lines[2] == "| c | SUCCESS | 0.900 | best |"
    assert lines[3] == "| a | FAILED | 0.700 | timeout |"
    assert lines[4] == "| b | SUCCESS | 0.700 | kept |"
