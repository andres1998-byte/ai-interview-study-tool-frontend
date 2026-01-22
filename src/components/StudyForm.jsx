import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

export default function StudyForm({ onSubmit, loading, hasData, initialValues, lastGeneratedParams, onParamsChange}) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const lastTopic = lastGeneratedParams?.topic?.trim();
 const lastLevel = lastGeneratedParams?.level;

  const [currentTopic, setCurrentTopic] = useState(
  initialValues?.topic || ""
);
const [currentLevel, setCurrentLevel] = useState(
  initialValues?.level || "Junior"
);

useEffect(() => {
  if (initialValues?.topic !== undefined) {
    setCurrentTopic(initialValues.topic);
  }

  if (initialValues?.level !== undefined) {
    setCurrentLevel(initialValues.level);
  }
}, [initialValues?.topic, initialValues?.level]);




const isUnchanged =
  lastTopic &&
  lastLevel &&
  currentTopic.trim() === lastTopic &&
  currentLevel === lastLevel;



function isSameAsLast() {
  if (!lastTopic || !lastLevel) return false;

  return (
    currentTopic.trim() === lastTopic &&
    currentLevel === lastLevel
  );
}



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
    const form = e.target;

    if (isSameAsLast(form)) {
     return; // no-op: nothing changed
   }

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
    <form ref={formRef} onSubmit={handleGenerate} className="space-y-5">
      {/* Topic input */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Topic
        </label>
        <input
          name="topic"
          value={currentTopic}
          onChange={(e) => {
  const value = e.target.value;
  setCurrentTopic(value);

  onParamsChange?.({
    topic: value,
    level: currentLevel,
    language: "Java",
  });
}}

          placeholder="e.g. HashMap, Binary Search, REST pagination"
          className="
            w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5
            text-sm text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100
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
          value={currentLevel}
  onChange={(e) => {
  const value = e.target.value;
  setCurrentLevel(value);

  onParamsChange?.({
    topic: currentTopic,
    level: value,
    language: "Java",
  });
}}

          className="
            w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5
            text-sm text-slate-900
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100
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
  disabled={(loading && !hasData) || isUnchanged}
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
            flex-1 rounded-lg bg-blue-600 px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        >
          Start Full Interview
        </button>
      </div>
    </form>
  );
}
