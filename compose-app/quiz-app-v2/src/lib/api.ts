import { Highscore, Question, Topic, TopicSummary } from "@/types/quiz";

const API_BASE_PATH = "/api/v1";

interface TopicsResponse {
  topics: TopicSummary[];
}

interface TopicQuestionsResponse {
  topic: TopicSummary;
  questions: Question[];
}

interface HighscoresResponse {
  highscores: Highscore[];
}

interface HighscoreResponse {
  highscore: Highscore;
}

interface UploadSummary {
  topicId: string;
  topicCreated: boolean;
  insertedQuestions: number;
  replacedQuestions: number;
}

interface UploadResponse {
  result: UploadSummary;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (payload?.error && typeof payload.error === "string") {
        message = payload.error;
      }
    } catch {
      // noop
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getTopics(): Promise<TopicSummary[]> {
  const data = await request<TopicsResponse>("/topics");
  return data.topics;
}

export async function getTopicById(topicId: string): Promise<Topic> {
  const params = new URLSearchParams();
  if (process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT) {
    params.set("limit", process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT);
  }
  const path = params.toString()
    ? `/topics/${topicId}/questions?${params.toString()}`
    : `/topics/${topicId}/questions`;

  const data = await request<TopicQuestionsResponse>(path);
  return {
    ...data.topic,
    questions: data.questions,
  };
}

export async function getHighscores(topicId: string, limit = 10): Promise<Highscore[]> {
  const params = new URLSearchParams({ topicId, limit: String(limit) });
  const data = await request<HighscoresResponse>(`/highscores?${params.toString()}`);
  return data.highscores;
}

export async function createHighscore(payload: {
  topicId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSeconds: number;
}): Promise<Highscore> {
  const data = await request<HighscoreResponse>("/highscores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return data.highscore;
}

export async function uploadQuestionsFile(file: File): Promise<UploadSummary> {
  const raw = await file.text();
  const parsed = JSON.parse(raw);

  const data = await request<UploadResponse>("/import/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed),
  });

  return data.result;
}
