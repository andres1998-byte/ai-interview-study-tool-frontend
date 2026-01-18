import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";


export default function StudyResult({ data, studyParams }) {
  const navigate = useNavigate();

  if (!data || !data.definition) {
    return (
      <p className="text-center text-slate-500 mt-10">
        Enter a valid topic to generate interview material.
      </p>
    );
  }

  return (
    <div className="mt-12 space-y-10">
      <Section title="Definition">
        <p>{data.definition}</p>
      </Section>

      <Section title="When to use">
        <ul className="list-disc ml-6 space-y-1">
          {data.whenToUse.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Example">
        <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-x-auto">
          {data.example.code}
        </pre>
        <p className="mt-3">{data.example.explanation}</p>
      </Section>

      <Section title="Complexity">
        <p>Average: {data.complexity.average}</p>
        <p>Worst: {data.complexity.worst}</p>
      </Section>

      <Section title="Common mistakes">
        <ul className="list-disc ml-6 space-y-1">
          {data.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Section>

      <Quiz quiz={data.quiz} />

      <div className="pt-8 border-t">
        <button
          onClick={() =>
            navigate("/interview", {
              state: studyParams,
            })
          }
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

