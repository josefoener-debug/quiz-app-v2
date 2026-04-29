CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (jsonb_typeof(options) = 'array'),
  CHECK (jsonb_array_length(options) >= 2),
  CHECK (correct_index >= 0)
);

CREATE TABLE IF NOT EXISTS highscores (
  id BIGSERIAL PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  player_name VARCHAR(40) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE highscores
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER NOT NULL DEFAULT 0;

ALTER TABLE highscores
DROP CONSTRAINT IF EXISTS highscores_duration_seconds_check;

ALTER TABLE highscores
ADD CONSTRAINT highscores_duration_seconds_check CHECK (duration_seconds >= 0);

CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_highscores_topic_id ON highscores(topic_id);
DROP INDEX IF EXISTS idx_highscores_ranking;
CREATE INDEX IF NOT EXISTS idx_highscores_ranking ON highscores(topic_id, duration_seconds ASC, created_at ASC);
