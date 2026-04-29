"use client";

import { useEffect, useMemo, useState } from "react";
import { Topic } from "@/types/quiz";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { createHighscore, getHighscores } from "@/lib/api";

type AnswerEntry = {
  selectedIndex: number;
  isCorrect: boolean;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function QuizRunner({ topic }: { topic: Topic }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerEntry | null)[]>(
    new Array(topic.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [justAnswered, setJustAnswered] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [highscores, setHighscores] = useState<
    Array<{
      id: number;
      playerName: string;
      percentage: number;
      score: number;
      totalQuestions: number;
      durationSeconds: number;
    }>
  >([]);
  const [highscoreError, setHighscoreError] = useState<string | null>(null);

  const question = topic.questions[currentIndex];

  useEffect(() => {
    if (submitted) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [startedAt, submitted]);

  const score = useMemo(
    () =>
      answers.reduce<number>((acc, answer) => {
        if (!answer) {
          return acc;
        }
        return acc + (answer.isCorrect ? 1 : 0);
      }, 0),
    [answers]
  );

  const percentage = useMemo(
    () => Math.round((score / topic.questions.length) * 100),
    [score, topic.questions.length]
  );

  const elapsedLabel = useMemo(() => formatDuration(elapsedSeconds), [elapsedSeconds]);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    let active = true;

    async function loadHighscores() {
      try {
        const data = await getHighscores(topic.id, 10);
        if (!active) {
          return;
        }
        setHighscores(data);
      } catch (error) {
        if (!active) {
          return;
        }
        setHighscoreError(
          error instanceof Error ? error.message : t.couldNotLoadHighscores
        );
      }
    }

    loadHighscores();

    return () => {
      active = false;
    };
  }, [submitted, topic.id, saveState, t.couldNotLoadHighscores]);

  function selectAnswer(optionIndex: number) {
    if (submitted || answers[currentIndex]) {
      return;
    }

    const isCorrect = optionIndex === question.correctIndex;
    const updated = [...answers];
    updated[currentIndex] = {
      selectedIndex: optionIndex,
      isCorrect,
    };
    setAnswers(updated);
    setJustAnswered(true);

    window.setTimeout(() => {
      setJustAnswered(false);
    }, 420);

    if (currentIndex === topic.questions.length - 1) {
      setSubmitted(true);
      return;
    }

    window.setTimeout(() => {
      setCurrentIndex((index) => index + 1);
    }, 420);
  }

  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  async function saveHighscore() {
    const trimmedName = playerName.trim();

    if (trimmedName.length < 2 || trimmedName.length > 40) {
      setNameError(t.nameLengthHint);
      return;
    }

    setNameError(null);
    setSaveState("saving");
    setSaveError(null);

    try {
      await createHighscore({
        topicId: topic.id,
        playerName: trimmedName,
        score,
        totalQuestions: topic.questions.length,
        percentage,
        durationSeconds: elapsedSeconds,
      });
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setSaveError(error instanceof Error ? error.message : t.couldNotLoadHighscores);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-slate-100">
            {t.quizComplete}
          </h2>
          <p className="mb-1 text-slate-500 dark:text-slate-300">{topic.name}</p>
          <p className="mb-6 text-sm font-semibold text-slate-500 dark:text-slate-300">
            {t.timeElapsed}: {elapsedLabel}
          </p>

          <div className="mb-6">
            <span className="text-6xl font-black text-cyan-600 dark:text-cyan-300">
              {percentage}%
            </span>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {t.correct(score, topic.questions.length)}
            </p>
          </div>

          <div className="space-y-3">
            {topic.questions.map((q, i) => (
              <div
                key={q.id}
                className={`rounded-xl p-3 text-left text-sm ${
                  answers[i]?.isCorrect
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                }`}
              >
                <span className="font-medium">Q{i + 1}:</span> {q.question}
                {!answers[i]?.isCorrect && (
                  <p className="mt-1 text-xs">
                    {t.correctAnswer} {q.options[q.correctIndex]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800/60">
            <p className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">{t.saveYourHighscore}</p>
            <div className="flex gap-2">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={40}
                placeholder={t.yourName}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                onClick={saveHighscore}
                disabled={saveState === "saving"}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:opacity-40"
              >
                {saveState === "saving" ? t.saving : t.save}
              </button>
            </div>
            {nameError && <p className="mt-2 text-xs text-red-700">{nameError}</p>}
            {saveState === "saved" && (
              <p className="mt-2 text-xs text-green-700">{t.highscoreSaved}</p>
            )}
            {saveState === "error" && saveError && (
              <p className="mt-2 text-xs text-red-700">{saveError}</p>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-left dark:border-slate-700 dark:bg-slate-900/70">
            <p className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">{t.topTen}</p>
            {highscoreError ? (
              <p className="text-xs text-red-700">{t.couldNotLoadHighscores} {highscoreError}</p>
            ) : highscores.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-300">{t.noHighscoresYet}</p>
            ) : (
              <ol className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
                {highscores.map((entry, index) => (
                  <li key={entry.id}>
                    {index + 1}. {entry.playerName} - {entry.percentage}% ({entry.score}/{entry.totalQuestions}) - {formatDuration(entry.durationSeconds)}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setAnswers(new Array(topic.questions.length).fill(null));
                setCurrentIndex(0);
                setSubmitted(false);
                setPlayerName("");
                setNameError(null);
                setSaveState("idle");
                setSaveError(null);
                setHighscoreError(null);
                setElapsedSeconds(0);
                setStartedAt(Date.now());
                setJustAnswered(false);
              }}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              {t.retry}
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t.allTopics}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span>{topic.name}</span>
        <span>
          {currentIndex + 1} / {topic.questions.length}
        </span>
      </div>

      <div className="mb-2 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all"
          style={{
            width: `${((currentIndex + 1) / topic.questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="mb-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
        {t.timeElapsed}: {elapsedLabel}
      </div>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const picked = answers[currentIndex]?.selectedIndex === i;
            const showCorrect = answers[currentIndex] && i === question.correctIndex;

            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                disabled={Boolean(answers[currentIndex])}
                className={`w-full rounded-xl border p-3 text-left text-sm font-semibold transition ${
                  showCorrect
                    ? `border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-100 ${justAnswered ? "answer-correct-flash" : ""}`
                    : picked
                      ? `border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-900/30 dark:text-rose-100 ${justAnswered ? "answer-wrong-flash" : ""}`
                      : "border-slate-200 text-slate-800 hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-start">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {t.previous}
        </button>
      </div>
    </div>
  );
}
