import { useState } from "react";

export default function Quiz({ quiz }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Quick quiz
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Test your understanding before moving on.
          </p>
        </div>

        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="
            rounded-lg border border-slate-300 px-3 py-1.5
            text-xs font-medium text-slate-900
            transition hover:bg-slate-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800
          "
        >
          {showAnswers ? "Hide answers" : "Show answers"}
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.map((q, i) => (
          <div
            key={i}
            className="
              rounded-xl border border-slate-200 bg-white p-4 shadow-sm
              dark:border-slate-700 dark:bg-slate-900
            "
          >
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {i + 1}. {q.question}
            </p>

            <ul className="mt-2 space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
              {q.options.map((opt) => (
                <li key={opt} className="flex items-start gap-2">
                  <span className="mt-0.5 text-slate-400 dark:text-slate-500">
                    •
                  </span>
                  <span>{opt}</span>
                </li>
              ))}
            </ul>

            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <span className="font-semibold">Correct answer:</span>{" "}
                {q.correctAnswer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
