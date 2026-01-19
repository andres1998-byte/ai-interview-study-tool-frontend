import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudyPage from "./pages/StudyPage";
import InterviewPage from "./pages/InterviewPage";
import CodeChallengePage from "./pages/CodeChallengePage";

function getInitialTheme() {
  const saved = localStorage.getItem("aiit_theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("aiit_theme", theme);
  }, [theme]);

  const themeLabel = useMemo(
    () => (theme === "dark" ? "Dark" : "Light"),
    [theme]
  );

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute -bottom-40 right-[-10rem] h-96 w-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/90 shadow-sm ring-1 ring-indigo-500/30 dark:bg-indigo-500/80" />
            <div>
              <p className="text-sm font-semibold leading-none">
                AI Interview Study Tool
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Study → Interview → Code challenge
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
          >
            <span className="text-base">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="hidden sm:inline">{themeLabel}</span>
          </button>
        </div>

        {/* App shell */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
            <Navbar />
          </div>

          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<StudyPage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/interview/code" element={<CodeChallengePage />} />
            </Routes>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Built by Andrés Villarreal • React + Tailwind + Spring Boot
        </div>
      </div>
    </div>
  );
}
