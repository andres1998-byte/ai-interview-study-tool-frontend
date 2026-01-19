import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startInterview, submitTheory } from "../api/interviewApi";

const PHASES = {
  INTRO: "intro",
  THEORY: "theory",
  REVIEW: "review",
  RESULT: "result",
};

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { topic, level, language = "Java" } = location.state || {};

  // 🔒 Navigation guard
  if (!topic || !level) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-4 text-sm font-medium text-rose-600 dark:text-rose-400">
            Interview data missing. Please start from the Study page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
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
  const [submitError, setSubmitError] = useState(null);


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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Interview Mode
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Get ready to simulate a real technical interview session.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                You’re about to start a {language} interview
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                This session simulates a real technical interview experience.
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Topic
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {topic}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Level
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {level}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Estimated time
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    ~10 minutes
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Format
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Theory → Coding challenge
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span>📘</span>
                <span>You will answer 5 multiple-choice theory questions.</span>
              </div>

              <div className="flex items-start gap-2">
                <span>💻</span>
                <span>
                  After theory, you’ll receive a short coding challenge.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span>⏱️</span>
                <span>
                  Try to answer as if you were in a real interview setting.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span>❌</span>
                <span>
                  Once started, you cannot go back to previous questions.
                </span>
              </div>
            </div>

            <button
              onClick={() => setPhase(PHASES.THEORY)}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start Interview
            </button>

            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              You can retake interviews as many times as you like.
            </p>
          </div>
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
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Starting interview…
        </p>
      );
    }

    const handleSelect = (questionId, answerText) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerText,
      }));
    };

    const handleSubmit = async () => {
  const totalQuestions = interview.theoryQuestions.length;
  const answeredCount = Object.keys(answers).length;

  if (answeredCount < totalQuestions) {
    setSubmitError(
      `Please answer all ${totalQuestions} questions before submitting the interview.`
    );
    return;
  }

  setSubmitError(null);
  setSubmitting(true);

  const payload = {
    interviewId: interview.interviewId,
    answers: answers,
  };

  const res = await submitTheory(payload);

  setResult(res);
  setSubmitting(false);
  setPhase(PHASES.REVIEW);
};


    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="mx-auto w-full max-w-3xl px-4">
          <h2 className="mb-6 text-xl font-semibold">Interview Mode</h2>

          <div className="space-y-6">
            {interview.theoryQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Question {idx + 1} of {interview.theoryQuestions.length}
                </p>

                <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, index) => {
                    const letter = String.fromCharCode(65 + index);

                    return (
                      <label
                        key={opt}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 p-3 text-sm cursor-pointer transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => handleSelect(q.id, opt)}
                          className="mt-1"
                        />
                        <span>
                          <span className="font-medium">{letter}.</span> {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

            {/* Submission section */}
<div className="mt-12 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
  <div className="mb-4 flex items-center justify-between">
    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
      Ready to submit your interview?
    </p>
    <p className="text-xs text-slate-500 dark:text-slate-400">
      {Object.keys(answers).length} / {interview.theoryQuestions.length} answered
    </p>
  </div>

  {submitError && (
    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
      {submitError}
    </div>
  )}

  <button
    disabled={submitting}
    onClick={handleSubmit}
    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
  >
    {submitting ? "Submitting..." : "Submit Answers"}
  </button>

  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
    You must answer all questions before submitting.
  </p>
</div>

        </div>
      </div>
    );
  }

  /* =========================
     REVIEW
     ========================= */
  if (phase === PHASES.REVIEW) {
    const resultsById = Object.fromEntries(
      result.results.map((r) => [r.questionId, r])
    );

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="mx-auto w-full max-w-3xl px-4">
          <h2 className="mb-2 text-xl font-semibold">Review your answers</h2>

          <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
            See which answers were correct before viewing your final score.
          </p>

          <div className="space-y-6">
            {interview.theoryQuestions.map((q, idx) => {
              const r = resultsById[q.id];
              const userAnswer = answers[q.id];
              const isCorrect = r?.correct;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Question {idx + 1}
                    </p>

                    {isCorrect ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Correct
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                        Incorrect
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, index) => {
                      const isUser = opt === userAnswer;
                      const isCorrectAnswer = opt === r.correctAnswer;

                      let style = "border-slate-200 dark:border-slate-800";

                      if (isCorrectAnswer) {
                        style =
                          "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20";
                      } else if (isUser && !isCorrect) {
                        style =
                          "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20";
                      }

                      return (
                        <div
                          key={opt}
                          className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${style}`}
                        >
                          <span className="mt-0.5 font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {!isCorrect && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                      Correct answer:{" "}
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        {r.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setPhase(PHASES.RESULT)}
            className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Continue to score
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
    result?.results?.filter((r) => r.correct === false) ?? [];

  const performanceLabel =
    score >= 80 ? "Strong performance" : score >= 60 ? "Fair performance" : "Needs improvement";

  const performanceColor =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";

  const feedbackText =
    score >= 80
      ? "Great job. You demonstrated strong understanding of the core concepts."
      : score >= 60
      ? "Good effort. Review the missed topics to improve your consistency."
      : "You're close. Focus on the missed concepts and try again to strengthen your fundamentals.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="mx-auto w-full max-w-3xl px-4">
        {/* Summary card */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Interview complete
          </p>

          <div className="mb-3 text-5xl font-bold tracking-tight text-indigo-600">
            {score}%
          </div>

          <p className={`mb-2 text-sm font-semibold ${performanceColor}`}>
            {performanceLabel}
          </p>

          <p className="mx-auto mb-6 max-w-md text-sm text-slate-600 dark:text-slate-300">
            {feedbackText}
          </p>

          <div className="mx-auto grid max-w-sm grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {total}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Correct
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                {correct}
              </p>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800 dark:bg-rose-900/20">
              <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-400">
                Missed
              </p>
              <p className="mt-1 text-lg font-semibold text-rose-700 dark:text-rose-300">
                {missed}
              </p>
            </div>
          </div>
        </div>

        {/* Missed questions */}
        {missedQuestions.length > 0 && (
          <div className="mb-10 space-y-6">
            <h3 className="text-lg font-semibold tracking-tight">
              Concepts to review
            </h3>

            {missedQuestions.map((q, index) => (
              <div
                key={q.questionId ?? index}
                className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
              >
                <p className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {q.questionText}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="text-rose-600 dark:text-rose-400">
                    <span className="font-medium">Your answer:</span>{" "}
                    {q.userAnswer}
                  </div>

                  <div className="text-emerald-600 dark:text-emerald-400">
                    <span className="font-medium">Correct answer:</span>{" "}
                    {q.correctAnswer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Back to Study
          </button>

          <button
            onClick={() =>
              navigate("/interview/code", {
                state: {
                  interviewId: interview.interviewId,
                  codingQuestion: interview.codingQuestion,
                },
              })
            }
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Continue to Coding Challenge
          </button>
        </div>
      </div>
    </div>
  );
}


  return null;
}
