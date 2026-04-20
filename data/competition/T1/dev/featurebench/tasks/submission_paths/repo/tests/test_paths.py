from pathlib import Path

from submission_paths import deep_merge, resolve_output_paths


def test_deep_merge_merges_nested_dicts() -> None:
    base = {"limits": {"time": 10, "memory": "16GB"}, "track": "T1"}
    override = {"limits": {"time": 20}, "autonomy": "fully_autonomous"}
    assert deep_merge(base, override) == {
        "limits": {"time": 20, "memory": "16GB"},
        "track": "T1",
        "autonomy": "fully_autonomous",
    }


def test_resolve_output_paths_slugifies_team_name() -> None:
    root = Path("workspace")
    resolved = resolve_output_paths(root, "Westlake NLP Team", "T1")
    assert resolved["submission"] == root / "t1-westlake-nlp-team" / "submission"
    assert resolved["logs"] == root / "t1-westlake-nlp-team" / "submission" / "logs"
    assert resolved["paper"] == root / "t1-westlake-nlp-team" / "submission" / "paper"
