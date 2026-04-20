# T1 Leaderboard Track — Dev Set (HLE + FeatureBench-lite)

## Files
- `hle_dev.json`: 10 questions from Humanity's Last Exam (text-only subset)
- `hle_answers.json`: Gold answers (for local evaluation only)
- `featurebench/`: public runnable engineering-task subset for local development

## Question Format
```json
{
  "id": "668825f80a642802bdfeadfa",
  "question": "Which condition of Arrhenius's sixth...\nAnswer Choices:\nA. ...",
  "answer_type": "multipleChoice",
  "image": ""
}
```

## Evaluation
- **Metric**: Exact match accuracy
- **Answer types**: multipleChoice (letter), open (free text), numeric
- **Scoring**: `0.6 * hle_accuracy + 0.4 * featurebench_pass_rate` (T1 direction weight: 0.35)

## Local Evaluation
```python
import json
questions = json.load(open("hle_dev.json"))
answers = {a["id"]: a["answer"] for a in json.load(open("hle_answers.json"))}

correct = 0
for q in questions:
    prediction = your_solver(q["question"])
    if prediction.strip().lower() == answers[q["id"]].strip().lower():
        correct += 1

accuracy = correct / len(questions)
print(f"HLE Dev Accuracy: {accuracy:.1%}")
```

## Notes
- Public local release includes HLE dev questions plus a runnable `FeatureBench-lite` subset
- Dev set is for local development only; final scores come from the official backend
- Questions span math, physics, biology, philosophy, linguistics, and more
