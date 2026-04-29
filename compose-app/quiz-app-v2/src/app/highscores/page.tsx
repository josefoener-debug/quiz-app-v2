"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getHighscores, getTopics } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";

type TopicWithScores = {
  id: string;
  name: string;
  highscores: Array<{
    id: number;
      playerName: string;
      percentage: number;
      score: number;
      totalQuestions: number;
      durationSeconds: number;
    }>;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function HighscoresPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicWithScores[]>([]);
  const topicCount = useMemo(() => topics.length, [topics]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const topicList = await getTopics();
        const scoreLists = await Promise.all(
          topicList.map(async (topic) => ({
            id: topic.id,
            name: topic.name,
            highscores: await getHighscores(topic.id, 10),
          }))
        );

        if (!active) {
          return;
        }

        setTopics(scoreLists);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load highscores page");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          &larr; {t.backToTopics}
        </Link>

        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{t.highscoresPageHeading}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.highscoresPageSubheading}</p>

        {loading ? (
          <p className="mt-6 text-slate-500 dark:text-slate-300">{t.loadingHighscoresPage}</p>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            {t.couldNotLoadHighscoresPage} {error}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {topics.map((topic) => (
              <section key={topic.id} className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{topic.name}</h2>
                {topic.highscores.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t.noHighscoresYet}</p>
                ) : (
                  <ol className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                    {topic.highscores.map((entry, index) => (
                      <li key={entry.id}>
                        {index + 1}. {entry.playerName} - {entry.percentage}% ({entry.score}/{entry.totalQuestions}) - {formatDuration(entry.durationSeconds)}
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
            {topicCount === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t.noHighscoresYet}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
