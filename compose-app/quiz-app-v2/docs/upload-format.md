# Upload Format

Only one format is allowed: JSON.

## Root structure

```json
{
  "topic": {
    "id": "kubernetes",
    "name": "Kubernetes",
    "description": "Container orchestration basics",
    "icon": "K8"
  },
  "questions": [
    {
      "question": "What is a Pod?",
      "options": ["Storage", "Deploy tool", "Smallest deployable unit", "Firewall"],
      "correctIndex": 2
    }
  ]
}
```

## Validation rules

- `topic.id`
  - required
  - lowercase slug only: `a-z`, `0-9`, `-`
  - max length 50
- `topic.name`
  - required, non-empty
  - max length 100
- `topic.description`
  - required, non-empty
  - max length 300
- `topic.icon`
  - required, non-empty
  - max length 8
- `questions`
  - required array
  - at least 1 entry
- `questions[].question`
  - required, non-empty
  - max length 300
- `questions[].options`
  - required array
  - min 2, max 6 options
  - each option non-empty string, max length 120
- `questions[].correctIndex`
  - required integer
  - must be in bounds of `options`

## Import behavior

- Import must run in a single DB transaction.
- If one item fails validation or insert, nothing is written.
- Exact duplicate question is replaced (same question text, same options, same `correctIndex`).
- New, non-duplicate questions are appended.
- Response includes:
  - `topicId`
  - `topicCreated`
  - `insertedQuestions`
  - `replacedQuestions`

## Example file

Use `examples/questions-upload.sample.json` as a ready-to-use reference for
manual upload tests.
