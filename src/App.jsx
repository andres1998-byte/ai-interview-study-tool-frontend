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
      console.log("Dark mode applied - classList:", root.classList.toString());
    } else {
      root.classList.remove("dark");
      console.log("Light mode applied - classList:", root.classList.toString());
    }

    localStorage.setItem("aiit_theme", theme);
  }, [theme]);

  const themeLabel = useMemo(
    () => (theme === "dark" ? "Dark" : "Light"),
    [theme]
  );

  function toggleTheme() {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      console.log("Theme toggled:", prev, "->", newTheme);
      return newTheme;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -bottom-40 right-[-10rem] h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 shadow-sm ring-1 ring-blue-500/30 dark:bg-blue-500" />
            <div>
              <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-50">
                AI Interview Study Tool
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Study → Interview → Code challenge
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 hover:shadow-md dark:border-yellow-500 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-400"
          >
            <span className="text-base">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="hidden sm:inline">{themeLabel} Mode - Click me!</span>
          </button>
        </div>

        {/* App shell */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6">
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
