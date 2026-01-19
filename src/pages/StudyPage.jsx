import { useState } from "react";
import { generateStudy } from "../api/studyApi";
import StudyForm from "../components/StudyForm";
import StudyResult from "../components/StudyResult";

export default function StudyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyParams, setStudyParams] = useState(null);

  async function handleGenerate(payload) {
    setLoading(true);
    setError(null);
    setStudyParams(payload); // keep storing for Start Interview

    try {
      const response = await generateStudy(payload);
      setData(response);
    } catch {
      setError("Please enter a real software engineering topic.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Study smarter. Interview sharper.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Generate concise study material and practice interview-style questions. When you’re ready,
          jump into the interview flow and finish with a coding challenge.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: form */}
        <section className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Create your study set</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick a topic and level — then generate.
                </p>
              </div>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
                AI-powered
              </span>
            </div>

            <StudyForm onSubmit={handleGenerate} loading={loading} />

            {/* Status / error */}
            <div className="mt-4">
              {loading && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Generating interview material...
                </p>
              )}

              {error && (
                <p className="text-center text-sm font-medium text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}
            </div>

            {/* Mini tips */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
              <p className="font-semibold text-slate-700 dark:text-slate-200">Pro tips</p>
              <ul className="mt-2 space-y-1">
                <li>• Try topics like “HashMap”, “Binary Search”, “SQL joins”, “REST pagination”.</li>
                <li>• Use the interview flow after you generate material (it uses the same topic).</li>
                <li>• Aim for clarity: definition → use cases → trade-offs → complexity.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right column: results */}
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Your generated material</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This section will fill as soon as you generate.
                </p>
              </div>

              {/* Small “state” badge */}
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium",
                  loading
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
                    : data
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                ].join(" ")}
              >
                {loading ? "Working…" : data ? "Ready" : "Waiting"}
              </span>
            </div>

            {/* Existing component (kept) */}
            <StudyResult data={data} studyParams={studyParams} />

            {!data && !loading && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Enter a topic on the left and click <span className="font-semibold">Generate</span>.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
