"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-white/20 bg-white/80 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-black tracking-tight text-cyan-700 dark:text-cyan-300">
            {t.appTitle}
          </Link>
          <Link
            href="/import"
            className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-sm font-semibold text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-50 dark:border-cyan-700 dark:bg-slate-900 dark:text-cyan-200 dark:hover:bg-slate-800"
          >
            {t.navImport}
          </Link>
          <Link
            href="/highscores"
            className="rounded-full border border-amber-200 bg-white px-3 py-1 text-sm font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-50 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800"
          >
            {t.navHighscores}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "light" ? t.navThemeDark : t.navThemeLight}
          </button>
          <div className="flex gap-1 rounded-full border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-900">
          <button
            onClick={() => setLocale("en")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              locale === "en"
                ? "bg-cyan-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale("de")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              locale === "de"
                ? "bg-cyan-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            DE
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
