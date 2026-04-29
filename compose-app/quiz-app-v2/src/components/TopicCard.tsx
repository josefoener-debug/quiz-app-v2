"use client";

import Link from "next/link";
import { TopicSummary } from "@/types/quiz";
import { useLanguage } from "@/i18n/LanguageContext";
import { TranslationKey } from "@/i18n/translations";

export default function TopicCard({ topic }: { topic: TopicSummary }) {
  const { t } = useLanguage();

  const descriptionKey =
    `topic.${topic.id}.description` as TranslationKey;
  const description = (t[descriptionKey] as string) || topic.description;

  return (
    <Link
      href={`/quiz/${topic.id}`}
      className="group block rounded-3xl border border-slate-200 bg-[linear-gradient(160deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg dark:border-slate-700 dark:bg-[linear-gradient(160deg,#0f1f35_0%,#132948_100%)]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-black text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200">
        {topic.icon}
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900 transition group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-300">
        {topic.name}
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-300">{description}</p>
      <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
        {t.questionsCount(topic.questionCount ?? 0)}
      </p>
    </Link>
  );
}
