import { useNavigate } from "react-router-dom";

export default function StudyForm({ onSubmit, loading }) {
  const navigate = useNavigate();

  const extractPayload = (form) => {
    const topic = form.topic.value.trim();
    const level = form.level.value;

    // 🔒 Frontend validation
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
      language: "Java"
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
    <form onSubmit={handleGenerate} className="space-y-4">
  <input
    name="topic"
    placeholder="Topic (e.g. HashMap)"
    className="w-full border border-slate-300 p-2.5 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
    required
  />

  <select
    name="level"
    className="w-full border border-slate-300 p-2.5 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
  >
    <option>Junior</option>
    <option>Mid</option>
    <option>Senior</option>
  </select>

  <div className="flex gap-3 pt-2">
    <button
      type="submit"
      disabled={loading}
      className="flex-1 border border-slate-300 py-2.5 rounded-md hover:bg-slate-50 disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate"}
    </button>

    <button
      type="button"
      onClick={handleStartInterview}
      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700"
    >
      Start Interview
    </button>
  </div>
</form>

  );
}
