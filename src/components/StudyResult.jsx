import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";

export default function StudyResult({ data, studyParams }) {
  const navigate = useNavigate();

  if (!data || !data.definition) {
    return (
      <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Enter a valid topic to generate interview material.
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <Section title="Definition">
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          {data.definition}
        </p>
      </Section>

      <Section title="When to use">
        <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
          {data.whenToUse.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
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
            {data.example.code}
          </pre>

          <p className="text-slate-700 dark:text-slate-300">
            {data.example.explanation}
          </p>
        </div>
      </Section>

      <Section title="Complexity">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Stat label="Average" value={data.complexity.average} />
          <Stat label="Worst" value={data.complexity.worst} />
        </div>
      </Section>

      <Section title="Common mistakes">
        <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
          {data.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Section>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 sm:p-6">
        <Quiz quiz={data.quiz} />
      </div>

      <div className="pt-6">
        <button
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
          "
        >
          Start Interview
        </button>
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
