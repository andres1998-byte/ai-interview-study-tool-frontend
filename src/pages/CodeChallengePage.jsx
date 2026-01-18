import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeChallengePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const interviewId = state?.interviewId;
  const codingQuestion = state?.codingQuestion;

  if (!interviewId || !codingQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center max-w-md">
          <h2 className="font-semibold text-slate-900 mb-1">
            Invalid interview session
          </h2>
          <p className="text-sm text-slate-600">
            Please restart the interview from the Study page.
          </p>
        </div>
      </div>
    );
  }

  const starterBody = useMemo(
    () =>
      `{
    // TODO: implement
}`,
    []
  );

  const [code, setCode] = useState(starterBody);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submitCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/interview/submit-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewId, code }),
        }
      );

      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const resetAttempt = () => {
    setResult(null);
    setCode(starterBody);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Coding Challenge
          </h1>
          <p className="text-slate-600 mt-1">
            Write the solution and submit it for AI evaluation.
          </p>
        </div>

        {/* ===== Problem ===== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-800 leading-relaxed">
            {codingQuestion.prompt}
          </p>

          <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700">
            💡 Focus on correctness, edge cases, and clean code.
          </div>
        </div>

        {/* ===== Editor Card ===== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Editor Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Method Signature
              </p>
              <div className="mt-2 rounded-lg bg-white border border-slate-200 px-4 py-2 font-mono text-sm text-slate-900">
                {codingQuestion.methodSignature}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-slate-600">
                Implement only the method body below.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCode(starterBody)}
                  className="px-3 py-1.5 text-sm rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800"
                >
                  Reset
                </button>

                <button
                  onClick={submitCode}
                  disabled={loading}
                  className="px-4 py-1.5 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  {loading ? "Evaluating…" : "Submit"}
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <Editor
            height="520px"
            language="java"
            theme="vs-light"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              wordWrap: "on",
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* ===== Evaluation Section (CLEARLY SEPARATE CARD) ===== */}
        {result && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Evaluation Result
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.passed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.passed ? "PASSED" : "NEEDS WORK"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <strong>Score:</strong> {result.score}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {result.passed ? "Solution accepted" : "Solution rejected"}
              </p>
            </div>

            <p className="mt-4 text-slate-700 leading-relaxed">
              {result.feedback}
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
  onClick={resetAttempt}
  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
>
  Start over
</button>


              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200"
              >
                Go back to homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
