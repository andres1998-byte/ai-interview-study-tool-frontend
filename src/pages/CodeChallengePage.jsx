import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { API_BASE_URL } from "../api/config";

const API_URL = `${API_BASE_URL}/api/interview/submit-code`;
const REQUEST_TIMEOUT_MS = 20000;

export default function CodeChallengePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const interviewId = state?.interviewId;
  const codingQuestion = state?.codingQuestion;

  // 🔒 Navigation guard
  if (!interviewId || !codingQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center max-w-md dark:bg-slate-900 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 mb-1 dark:text-slate-50">
            Invalid interview session
          </h2>
          <p className="text-sm text-slate-600 mb-4 dark:text-slate-300">
            Please restart the interview from the Study page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go back
          </button>
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
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const submitCode = async () => {
    if (loading) return;

    const trimmed = code.trim();

    // 🚫 Prevent empty or unchanged submission
    if (!trimmed || trimmed === starterBody.trim()) {
      setError("Please implement a solution before submitting.");
      return;
    }

    setError(null);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ interviewId, code }),
      });

      if (!res.ok) {
        let message = "Code evaluation failed.";

        try {
          const text = await res.text();
          if (text) {
            message = text;
          }
        } catch {
          // ignore
        }

        throw new Error(message);
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server.");
      }

      if (
        typeof data?.passed !== "boolean" ||
        typeof data?.score !== "number" ||
        typeof data?.feedback !== "string"
      ) {
        throw new Error("Malformed evaluation response.");
      }

      setResult(data);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Evaluation timed out. Please try again.");
      } else {
        setError(err.message || "Unexpected error during evaluation.");
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
      setLoading(false);
    }
  };

  const resetAttempt = () => {
    setResult(null);
    setError(null);
    setCode(starterBody);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Coding Challenge
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Write the solution and submit it for AI evaluation.
          </p>
        </div>

        {/* ===== Problem ===== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 dark:bg-slate-900 dark:border-slate-700">
          <p className="text-slate-900 dark:text-slate-100 leading-relaxed">
            {codingQuestion.prompt}
          </p>

          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
            💡 Focus on correctness, edge cases, and clean code.
          </div>
        </div>

        {/* ===== Editor Card ===== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">
          {/* Editor Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-3 dark:bg-slate-800 dark:border-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Method Signature
              </p>
              <div className="mt-2 rounded-lg bg-white border border-slate-200 px-4 py-2 font-mono text-sm text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                {codingQuestion.methodSignature}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Implement only the method body below.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCode(starterBody)}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm rounded-md bg-slate-200 hover:bg-slate-300 text-slate-900 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100"
                >
                  Reset
                </button>

                <button
                  onClick={submitCode}
                  disabled={loading}
                  className="px-4 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {loading ? "Evaluating…" : "Submit"}
                </button>
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="border-t border-slate-200 bg-rose-50 px-6 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

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
              readOnly: loading,
            }}
          />
        </div>

        {/* ===== Evaluation Section ===== */}
        {result && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Evaluation Result
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.passed
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                }`}
              >
                {result.passed ? "PASSED" : "NEEDS WORK"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <strong>Score:</strong> {result.score}%
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {result.passed ? "Solution accepted" : "Solution rejected"}
              </p>
            </div>

            <p className="mt-4 text-slate-900 dark:text-slate-100 leading-relaxed">
              {result.feedback}
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={resetAttempt}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Start over
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-md hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
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
