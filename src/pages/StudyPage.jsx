import { useState, useRef, useEffect } from "react";
import { generateStudy } from "../api/studyApi";
import StudyForm from "../components/StudyForm";
import StudyResult from "../components/StudyResult";

export default function StudyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyParams, setStudyParams] = useState(null);
  const [draftParams, setDraftParams] = useState(null);

  const generatingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
  const savedStudy = sessionStorage.getItem("lastStudy");
  const savedDraft = sessionStorage.getItem("draftStudyParams");

  if (savedStudy) {
    try {
      const parsed = JSON.parse(savedStudy);

      if (parsed?.data && parsed?.params) {
        setData(parsed.data);
        setStudyParams(parsed.params);
      }
    } catch {
      sessionStorage.removeItem("lastStudy");
    }
  }

  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft);

      if (parsedDraft?.topic && parsedDraft?.level) {
        setDraftParams(parsedDraft);
      }
    } catch {
      sessionStorage.removeItem("draftStudyParams");
    }
  }
}, []);


useEffect(() => {
  if (draftParams?.topic && draftParams?.level) {
    sessionStorage.setItem(
      "draftStudyParams",
      JSON.stringify(draftParams)
    );
  }
}, [draftParams]);



  async function handleGenerate(payload) {
  // 🔒 Extra guard: block while already loading
if (loading && !data) {
  setError("A study set is already being generated. Please wait.");
  return;
}


if (generatingRef.current) {
  // stale ref safety: allow regeneration if loading is false
  generatingRef.current = false;
}

generatingRef.current = true;


  // 🔎 Basic frontend validation
  if (
    !payload ||
    !payload.topic ||
    !payload.topic.trim() ||
    !payload.level ||
    !payload.level.trim()
  ) {
    setError("Please enter a valid topic and level.");
    generatingRef.current = false;
    return;
  }

  setData(null);
  setLoading(true);
  setError(null);
  setStudyParams(payload);
  setDraftParams(payload);


  try {
  const response = await generateStudy(payload);

  // 🧠 Backend semantic validation
  if (
    !response ||
    typeof response.definition !== "string" ||
    !Array.isArray(response.quiz) ||
    response.quiz.length === 0 ||
    response.definition.toLowerCase().includes("invalid")
  ) {
    throw new Error(
      response?.definition && response.definition !== "Invalid topic"
        ? response.definition
        : "Invalid topic. Please enter a real technical concept."
    );
  }

  // ✅ Always accept valid responses
  setData(response);

  sessionStorage.setItem(
    "lastStudy",
    JSON.stringify({
      data: response,
      params: payload,
    })
  );

} catch (err) {
  setError(
    err?.message ||
      "Failed to generate study material. Please try again."
  );

} finally {
  // 🧯 ALWAYS release loading + ref (never gate cleanup)
  setLoading(false);
  generatingRef.current = false;
}

}


  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Study smarter. Interview sharper.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Generate concise study material and practice interview-style questions. When you’re ready,
          jump into the interview flow and finish with a coding challenge.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: form */}
        <section className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Create your study set</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pick a topic and level — then generate.
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                AI-powered
              </span>
            </div>

            <StudyForm
  onSubmit={handleGenerate}
  loading={loading}
  hasData={!!data}
  initialValues={draftParams || studyParams}
  lastGeneratedParams={studyParams}
  onParamsChange={setDraftParams}
/>






            {/* Status / error */}
            <div className="mt-4">
              {loading && !data && (
  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
    Generating interview material...
  </p>
)}


              {error && (
                <p className="text-center text-sm font-medium text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}
            </div>

            {/* Mini tips */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Pro tips
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Try topics like “HashMap”, “Binary Search”, “SQL joins”, “REST pagination”.</li>
                <li>• Use the interview flow after you generate material (it uses the same topic).</li>
                <li>• Aim for clarity: definition → use cases → trade-offs → complexity.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right column: results */}
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Your generated material</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This section will fill as soon as you generate.
                </p>
              </div>

              {/* Small "state" badge */}
              <span
                className={[
  "rounded-full px-3 py-1 text-xs font-medium",
  data
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    : loading
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
].join(" ")}

              >
                {data ? "Ready" : loading ? "Working…" : "Waiting"}
              </span>
            </div>

            <StudyResult data={data} studyParams={studyParams} />

            {!data && !loading && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Enter a topic on the left and click{" "}
                <span className="font-semibold">Generate</span>.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
