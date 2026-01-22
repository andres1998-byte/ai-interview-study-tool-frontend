import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";

export default function StudyResult({ data, studyParams }) {
  const navigate = useNavigate();

  // 🔒 Hard guard: no data or missing core field
  // 🔒 Hard guard: no data or missing core field
if (!data || typeof data !== "object" || !data.definition) {
  return null;
}


  // 🛡️ Safe destructuring with fallbacks
  const {
    definition,
    whenToUse = [],
    example = {},
    complexity = {},
    commonMistakes = [],
    quiz = null,
  } = data;

  const exampleCode = example?.code || "// Example unavailable.";
  const exampleExplanation =
    example?.explanation || "No explanation provided.";

  const averageComplexity =
    complexity?.average || "Not specified";
  const worstComplexity =
    complexity?.worst || "Not specified";

  const safeWhenToUse = Array.isArray(whenToUse) ? whenToUse : [];
  const safeMistakes = Array.isArray(commonMistakes)
    ? commonMistakes
    : [];

  const canStartInterview =
    studyParams &&
    typeof studyParams === "object" &&
    studyParams.topic &&
    studyParams.level;

  return (
    <div className="mt-10 space-y-8">
      <Section title="Definition">
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          {definition}
        </p>
      </Section>

      <Section title="When to use">
        {safeWhenToUse.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
            {safeWhenToUse.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No usage guidance available.
          </p>
        )}
      </Section>

      <Section title="Example">
        <div className="space-y-4">
          <pre
            className="
              overflow-x-auto rounded-lg border border-slate-200
              bg-slate-100 p-4 text-sm text-slate-800
              dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100
            "
          >
            {exampleCode}
          </pre>

          <p className="text-slate-700 dark:text-slate-300">
            {exampleExplanation}
          </p>
        </div>
      </Section>

      <Section title="Complexity">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Stat label="Average" value={averageComplexity} />
          <Stat label="Worst" value={worstComplexity} />
        </div>
      </Section>

      <Section title="Common mistakes">
        {safeMistakes.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
            {safeMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No common mistakes listed.
          </p>
        )}
      </Section>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 sm:p-6">
        {quiz ? (
          <Quiz quiz={quiz} />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quiz unavailable for this topic.
          </p>
        )}
      </div>

      <div className="pt-6">
        <button
          disabled={!canStartInterview}
          onClick={() =>
            navigate("/interview", {
              state: studyParams,
            })
          }
          className="
            w-full rounded-xl bg-indigo-600 px-4 py-3
            text-sm font-semibold text-white
            transition hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Start Full Interview
        </button>

        {!canStartInterview && (
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Generate a valid study topic before starting the interview.
          </p>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 sm:p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}
