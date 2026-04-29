# Data Model

## Overview

The persistence layer uses PostgreSQL with three core tables:

- `topics`
- `questions`
- `highscores`

All tables are created by `services/db/init/001_schema.sql` and seeded by
`services/db/init/002_seed.sql` on first DB initialization.

## Table: `topics`

- `id` (TEXT, PK) - stable slug, e.g. `docker`
- `name` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `icon` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, default `now()`)

## Table: `questions`

- `id` (BIGSERIAL, PK)
- `topic_id` (TEXT, FK -> `topics.id`, ON DELETE CASCADE)
- `question_text` (TEXT, NOT NULL)
- `options` (JSONB array, NOT NULL, min 2 entries)
- `correct_index` (INTEGER, NOT NULL, >= 0)
- `created_at` (TIMESTAMPTZ, default `now()`)

## Table: `highscores`

- `id` (BIGSERIAL, PK)
- `topic_id` (TEXT, FK -> `topics.id`, ON DELETE CASCADE)
- `player_name` (VARCHAR(40), NOT NULL)
- `score` (INTEGER, NOT NULL, >= 0)
- `total_questions` (INTEGER, NOT NULL, > 0)
- `percentage` (INTEGER, NOT NULL, 0..100)
- `duration_seconds` (INTEGER, NOT NULL, >= 0)
- `created_at` (TIMESTAMPTZ, default `now()`)

## Indexes

- `idx_questions_topic_id`
- `idx_highscores_topic_id`
- `idx_highscores_ranking` on `(topic_id, duration_seconds ASC, created_at ASC)`

## Notes

- Topic deletion cascades to questions and highscores.
- Questions use `JSONB` for options to keep schema simple for teaching.
- Ranking logic is deterministic via `duration_seconds ASC, created_at ASC`.
- Seed data is stored directly in `services/db/init/002_seed.sql` (no JSON seed import at init time).
- API startup also enforces `duration_seconds` schema compatibility for existing DBs.
