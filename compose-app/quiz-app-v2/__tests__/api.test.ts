import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createHighscore,
  getHighscores,
  getTopicById,
  getTopics,
  uploadQuestionsFile,
} from "@/lib/api";

const originalEnvLimit = process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT;

afterEach(() => {
  vi.restoreAllMocks();

  if (originalEnvLimit === undefined) {
    delete process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT;
  } else {
    process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT = originalEnvLimit;
  }
});

describe("lib/api", () => {
  it("loads topics from the API", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            topics: [
              {
                id: "docker",
                name: "Docker",
                description: "Containers",
                icon: "D",
                questionCount: 10,
              },
            ],
          }),
          { status: 200 }
        )
      );

    const topics = await getTopics();

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/topics", {
      cache: "no-store",
    });
    expect(topics).toHaveLength(1);
    expect(topics[0]?.id).toBe("docker");
  });

  it("passes question limit when loading a topic", async () => {
    process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT = "5";

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            topic: {
              id: "git",
              name: "Git",
              description: "Version control",
              icon: "G",
            },
            questions: [
              {
                id: "q1",
                question: "What is a branch?",
                options: ["A", "B", "C"],
                correctIndex: 0,
              },
            ],
          }),
          { status: 200 }
        )
      );

    const topic = await getTopicById("git");

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/topics/git/questions?limit=5", {
      cache: "no-store",
    });
    expect(topic.questions).toHaveLength(1);
  });

  it("loads a topic without limit if env var is missing", async () => {
    delete process.env.NEXT_PUBLIC_QUIZ_QUESTION_LIMIT;

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            topic: {
              id: "docker",
              name: "Docker",
              description: "Containers",
              icon: "D",
            },
            questions: [],
          }),
          { status: 200 }
        )
      );

    await getTopicById("docker");

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/topics/docker/questions", {
      cache: "no-store",
    });
  });

  it("loads highscores with topicId and limit", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            highscores: [
              {
                id: 7,
                topicId: "git",
                playerName: "Mia",
                score: 8,
                totalQuestions: 10,
                percentage: 80,
                durationSeconds: 52,
                createdAt: "2026-01-01T12:00:00.000Z",
              },
            ],
          }),
          { status: 200 }
        )
      );

    const highscores = await getHighscores("git", 5);

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/highscores?topicId=git&limit=5", {
      cache: "no-store",
    });
    expect(highscores).toHaveLength(1);
    expect(highscores[0]?.playerName).toBe("Mia");
  });

  it("sends a highscore payload as JSON", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            highscore: {
              id: 1,
              topicId: "docker",
              playerName: "Alex",
              score: 9,
              totalQuestions: 10,
              percentage: 90,
              durationSeconds: 48,
              createdAt: "2026-01-01T12:00:00.000Z",
            },
          }),
          { status: 200 }
        )
      );

    const payload = {
      topicId: "docker",
      playerName: "Alex",
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      durationSeconds: 48,
    };

    await createHighscore(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/highscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  });

  it("uploads parsed JSON from the selected file", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: {
              topicId: "terraform",
              topicCreated: true,
              insertedQuestions: 4,
              replacedQuestions: 0,
            },
          }),
          { status: 200 }
        )
      );

    const file = new File(
      [
        JSON.stringify({
          topic: {
            id: "terraform",
            name: "Terraform",
            description: "IaC",
            icon: "T",
          },
          questions: [],
        }),
      ],
      "questions.json",
      { type: "application/json" }
    );

    const result = await uploadQuestionsFile(file);

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/import/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: {
          id: "terraform",
          name: "Terraform",
          description: "IaC",
          icon: "T",
        },
        questions: [],
      }),
      cache: "no-store",
    });
    expect(result.topicId).toBe("terraform");
  });

  it("uses API error message when request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Topic not found" }), { status: 404 })
    );

    await expect(getTopicById("missing-topic")).rejects.toThrow("Topic not found");
  });

  it("uses fallback error message when response is not JSON", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("Internal Server Error", { status: 500 })
    );

    await expect(getTopics()).rejects.toThrow("Request failed (500)");
  });

  it("throws for invalid upload JSON before calling API", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    const file = new File(["this is not json"], "broken.json", {
      type: "application/json",
    });

    await expect(uploadQuestionsFile(file)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
