"use client";

import Link from "next/link";
import { useState } from "react";
import { uploadQuestionsFile } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ImportPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    topicId: string;
    topicCreated: boolean;
    insertedQuestions: number;
    replacedQuestions: number;
  } | null>(null);

  async function onUpload() {
    if (!file) {
      setError(t.selectJsonFirst);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadQuestionsFile(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploadFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          &larr; {t.backToTopics}
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{t.importQuestions}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t.importDescription}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            />
            <button
              onClick={onUpload}
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:opacity-40"
            >
              {loading ? t.uploading : t.upload}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
              {t.importSuccessful} <strong>{result.topicId}</strong>,
              {" "}
              {result.topicCreated ? t.created : t.updated},
              {" "}
              {result.insertedQuestions} {t.questionsInserted} ({result.replacedQuestions} replaced).
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
