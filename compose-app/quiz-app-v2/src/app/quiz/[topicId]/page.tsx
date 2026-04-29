"use client";

import { use, useEffect, useState } from "react";
import QuizRunner from "@/components/QuizRunner";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { getTopicById } from "@/lib/api";
import { Topic } from "@/types/quiz";

export default function QuizPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const { t } = useLanguage();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTopic() {
      try {
        const data = await getTopicById(topicId);
        if (!active) {
          return;
        }
        setTopic(data);
      } catch (err) {
        if (!active) {
          return;
        }
        const message = err instanceof Error ? err.message : "Could not load topic";
        if (message.toLowerCase().includes("not found")) {
          setNotFoundError(true);
        } else {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTopic();

    return () => {
      active = false;
    };
  }, [topicId]);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          &larr; {t.backToTopics}
        </Link>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-300">{t.loadingQuiz}</p>
        ) : notFoundError ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            {t.topicNotFound}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            {t.couldNotLoadQuiz} {error}
          </div>
        ) : topic ? (
          <QuizRunner topic={topic} />
        ) : null}
      </div>
    </main>
  );
}
