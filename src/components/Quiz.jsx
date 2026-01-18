import { useState } from "react";

export default function Quiz({ quiz }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <section className="bg-gray-50 p-4 rounded-md">
      <h2 className="font-semibold text-lg mb-2">Quick quiz</h2>

      {quiz.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium">{q.question}</p>
          <ul className="ml-4">
            {q.options.map((opt) => (
              <li key={opt}>• {opt}</li>
            ))}
          </ul>
          {showAnswers && (
            <p className="text-sm text-green-700 mt-1">
              Correct answer: {q.correctAnswer}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={() => setShowAnswers(!showAnswers)}
        className="mt-2 text-sm underline"
      >
        {showAnswers ? "Hide answers" : "Show answers"}
      </button>
    </section>
  );
}
