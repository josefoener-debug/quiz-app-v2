# API Contract

## Base URL

- Internal (Compose): `http://api:4000`
- Version prefix: `/api/v1`

## `GET /api/v1/health`

Checks API and DB reachability.

**200 response (DB reachable)**

```json
{
  "status": "ok",
  "db": "up"
}
```

**503 response (DB not reachable)**

```json
{
  "status": "degraded",
  "db": "down"
}
```

## `GET /api/v1/topics`

Returns all topics including question count.

**200 response**

```json
{
  "topics": [
    {
      "id": "docker",
      "name": "Docker",
      "description": "Containerization basics",
      "icon": "Do",
      "questionCount": 12
    }
  ]
}
```

## `GET /api/v1/topics/:topicId/questions?limit=10`

- Returns a random subset of questions for one topic.
- `limit` is optional.
- If omitted, API uses `QUIZ_QUESTION_LIMIT`.
- Allowed range for `limit`: `1..100`.

**200 response**

```json
{
  "topic": {
    "id": "docker",
    "name": "Docker",
    "description": "Containerization basics",
    "icon": "Do"
  },
  "questions": [
    {
      "id": 1,
      "question": "What does FROM do?",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 1
    }
  ]
}
```

**400 response**

```json
{
  "error": "limit must be an integer between 1 and 100"
}
```

**404 response**

```json
{
  "error": "Topic not found"
}
```

## `GET /api/v1/highscores?topicId=<id>&limit=10`

- `topicId` is required.
- `limit` is optional (default `10`, allowed range `1..100`).

**200 response**

```json
{
  "highscores": [
    {
      "id": 1,
      "topicId": "docker",
      "playerName": "Mara",
      "score": 6,
      "totalQuestions": 7,
      "percentage": 86,
      "durationSeconds": 74,
      "createdAt": "2026-04-02T10:00:00.000Z"
    }
  ]
}
```

- Ranking order: shortest `durationSeconds` first, then oldest `createdAt`.

**400 response (`topicId` missing)**

```json
{
  "error": "topicId query param is required"
}
```

**400 response (`limit` invalid)**

```json
{
  "error": "limit must be an integer between 1 and 100"
}
```

## `POST /api/v1/highscores`

- Creates one highscore entry for an existing topic.
- `playerName` is trimmed before insert.

**request**

```json
{
  "topicId": "docker",
  "playerName": "Mara",
  "score": 6,
  "totalQuestions": 7,
  "percentage": 86,
  "durationSeconds": 74
}
```

**201 response**

```json
{
  "highscore": {
    "id": 2,
    "topicId": "docker",
    "playerName": "Mara",
    "score": 6,
    "totalQuestions": 7,
    "percentage": 86,
    "durationSeconds": 74,
    "createdAt": "2026-04-02T10:05:00.000Z"
  }
}
```

**400 response examples**

```json
{
  "error": "topicId does not exist"
}
```

```json
{
  "error": "playerName is required and must be <= 40 characters"
}
```

## `POST /api/v1/import/questions`

- Accepts a JSON payload according to `docs/upload-format.md`
- Validates full payload before insert
- Uses a transaction (all-or-nothing)
- Import behavior:
  - exact duplicate question is replaced (delete + insert)
  - non-existing question is appended

**201 response**

```json
{
  "result": {
    "topicId": "docker",
    "topicCreated": false,
    "insertedQuestions": 3,
    "replacedQuestions": 1
  }
}
```

**400 response examples**

```json
{
  "error": "topic.id must be a slug ([a-z0-9-], max 50)"
}
```

```json
{
  "error": "questions[0].options must contain 2 to 6 items"
}
```
