import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startInterview, submitTheory } from "../api/interviewApi";

const PHASES = {
  INTRO: "intro",
  THEORY: "theory",
  RESULT: "result",
};

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { topic, level, language = "Java" } = location.state || {};

  // 🔒 Navigation guard
  if (!topic || !level) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md">
          <p className="text-red-600 mb-4">
            Interview data missing. Please start from the Study page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const [phase, setPhase] = useState(PHASES.INTRO);
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // 🚀 Start interview ONLY when entering THEORY phase
  useEffect(() => {
    if (phase !== PHASES.THEORY) return;

    async function initInterview() {
      setLoading(true);

      const res = await startInterview({
        topic,
        level,
        language,
      });

      setInterview({
        interviewId: res.interviewId,
        theoryQuestions: res.theoryQuestions || [],
        codingQuestion: res.codingQuestion,
      });

      setLoading(false);
    }

    initInterview();
  }, [phase, topic, level, language]);

  /* =========================
     INTRO
     ========================= */
  if (phase === PHASES.INTRO) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white max-w-lg w-full rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {language} Interview
          </h1>

          <p className="text-center text-slate-600 mb-6">
            Topic: <span className="font-medium">{topic}</span> · Level:{" "}
            <span className="font-medium">{level}</span>
          </p>

          <div className="space-y-3 mb-6 text-sm text-slate-700">
            <div>⏱️ Estimated time: ~10 minutes</div>
            <div>📘 5 theory questions</div>
            <div>💻 Coding challenge after theory</div>
            <div>❌ No backtracking once started</div>
          </div>

          <button
            onClick={() => setPhase(PHASES.THEORY)}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700"
          >
            Begin Interview
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     THEORY
     ========================= */
  if (phase === PHASES.THEORY) {
    if (loading || !interview) {
      return (
        <p className="text-center mt-10 text-slate-500">
          Starting interview…
        </p>
      );
    }

    const handleSelect = (questionId, answerText) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerText, // ✅ STORE TEXT
      }));
    };

    const handleSubmit = async () => {
      setSubmitting(true);

      const payload = {
        interviewId: interview.interviewId,
        answers: answers, // ✅ { "1": "16", "2": "get()", ... }
      };

      const res = await submitTheory(payload);

      setResult(res);
      setSubmitting(false);
      setPhase(PHASES.RESULT);
    };

    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">
            Interview Mode
          </h2>

          <div className="space-y-6">
            {interview.theoryQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <p className="font-medium mb-2">
                  Question {idx + 1} of {interview.theoryQuestions.length}
                </p>

                <p className="mb-3">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, index) => {
                    const letter = String.fromCharCode(65 + index); // A, B, C, D

                    return (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => handleSelect(q.id, opt)}
                        />
                        <span>
                          {letter}. {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     RESULT
     ========================= */
  if (phase === PHASES.RESULT) {
  const total = result?.totalQuestions ?? 0;
  const correct = result?.correctAnswers ?? 0;
  const missed = total - correct;
  const score = result?.scorePercentage ?? 0;

  const missedQuestions =
    result?.results?.filter(r => r.correct === false) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* ===== Summary Card ===== */}
        <div className="bg-white p-8 rounded-xl shadow-sm text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Interview Complete
          </h2>

          <div className="text-4xl font-bold text-indigo-600 mb-4">
            {score}%
          </div>

          <div className="space-y-1 text-slate-700">
            <div>Total questions: {total}</div>
            <div className="text-green-600">
              Correct answers: {correct}
            </div>
            <div className="text-red-600">
              Questions missed: {missed}
            </div>
          </div>
        </div>

        {/* ===== Review Missed Questions ===== */}
        {missedQuestions.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              Review missed questions
            </h3>

            {missedQuestions.map((q, index) => (
              <div
                key={q.questionId ?? index}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <p className="font-medium mb-3">
                  {q.questionText}
                </p>

                <div className="space-y-1 text-sm">
                  <div className="text-red-600">
                    <span className="font-medium">
                      Your answer:
                    </span>{" "}
                    {q.userAnswer}
                  </div>

                  <div className="text-green-600">
                    <span className="font-medium">
                      Correct answer:
                    </span>{" "}
                    {q.correctAnswer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Actions ===== */}
        <div className="mt-10 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
          >
            Back to Study
          </button>

          <button
  onClick={() =>
    navigate("/interview/code", {
      state: {
        interviewId: interview.interviewId,
        codingQuestion: interview.codingQuestion
      }
    })
  }
  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
>
  Continue
</button>



        </div>
      </div>
    </div>
  );
}



  return null;
}
