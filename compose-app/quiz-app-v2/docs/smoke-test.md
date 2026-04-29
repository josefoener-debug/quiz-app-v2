# Smoke Test

Run this checklist before class.

## 1) Vorbereitung

- `cp .env.example .env`
- `docker build -f services/web/Dockerfile -t quiz-web:local .`
- `docker build -f services/api/Dockerfile -t quiz-api:local ./services/api`
- `compose.yaml` lokal erstellen

## 2) Fresh start

- `docker compose down -v`
- `docker compose up`

Expected:

- `web`, `api`, `db` are running

Hinweis:

- Ein `api` Healthcheck ist optional und kann fehlen.

## 3) Frontend availability

- Open `http://localhost:3000`

Expected:

- Topic list is visible
- No crash screen

## 4) Internal API availability (optional check)

- `docker compose exec api node -e "fetch('http://localhost:4000/api/v1/health').then(r=>r.json()).then(console.log)"`

Expected:

- JSON with `status: 'ok'`

## 5) Quiz flow

- Open one topic and complete a quiz

Expected:

- Result is shown

Optional check:

- Set a name and save a highscore in the result screen

## 6) Highscore persistence

- Submit a highscore
- Restart stack: `docker compose down && docker compose up`

Expected:

- Highscore still present

## 7) Upload flow

- Upload `examples/questions-upload.sample.json`

Expected:

- Success message with imported count
- New topic appears on home page

## 8) Dedicated highscores page

- Open `http://localhost:3000/highscores`

Expected:

- Highscores grouped by topic are visible
