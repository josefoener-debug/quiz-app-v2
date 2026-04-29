export interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TopicSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount?: number;
}

export interface Topic extends TopicSummary {
  questions: Question[];
}

export interface Highscore {
  id: number;
  topicId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSeconds: number;
  createdAt: string;
}
