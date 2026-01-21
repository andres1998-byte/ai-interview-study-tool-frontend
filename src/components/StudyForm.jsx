import { useNavigate } from "react-router-dom";

export default function StudyForm({ onSubmit, loading, hasData }) {
  const navigate = useNavigate();

  const extractPayload = (form) => {
    const topic = form.topic.value.trim();
    const level = form.level.value;

    // 🔒 Frontend validation (unchanged)
    if (topic.length < 3) {
      alert("Please enter a valid topic (at least 3 characters).");
      return null;
    }

    if (!/[a-zA-Z]/.test(topic)) {
      alert("Topic must contain letters.");
      return null;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9\s+#.-]{2,}$/.test(topic)) {
      alert("Please enter a real technical topic.");
      return null;
    }

    return {
      topic,
      level,
      language: "Java",
    };
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const payload = extractPayload(e.target);
    if (!payload) return;
    onSubmit(payload);
  };

  const handleStartInterview = (e) => {
    const form = e.target.form;
    const payload = extractPayload(form);
    if (!payload) return;

    navigate("/interview", { state: payload });
  };

  return (
    <form onSubmit={handleGenerate} className="space-y-5">
      {/* Topic input */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Topic
        </label>
        <input
          name="topic"
          placeholder="e.g. HashMap, Binary Search, REST pagination"
          className="
            w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5
            text-sm text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
            dark:placeholder:text-slate-500
          "
          required
        />
      </div>

      {/* Level select */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Level
        </label>
        <select
          name="level"
          className="
            w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5
            text-sm text-slate-900
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
          "
        >
          <option>Junior</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
  type="submit"
  disabled={loading && !hasData}
  className="
    flex-1 rounded-lg border border-slate-300 px-4 py-2.5
    text-sm font-medium text-slate-800
    transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800
  "
>
  {loading && !hasData ? "Generating…" : "Generate"}
</button>


        <button
          type="button"
          onClick={handleStartInterview}
          className="
            flex-1 rounded-lg bg-indigo-600 px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          Start Interview
        </button>
      </div>
    </form>
  );
}
