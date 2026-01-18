import { useState } from "react";
import { generateStudy } from "../api/studyApi";
import StudyForm from "../components/StudyForm";
import StudyResult from "../components/StudyResult";

export default function StudyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyParams, setStudyParams] = useState(null);


  async function handleGenerate(payload) {
  setLoading(true);
  setError(null);
  setStudyParams(payload); // 👈 STORE IT

  try {
    const response = await generateStudy(payload);
    setData(response);
  } catch {
    setError("Please enter a real software engineering topic.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-center mb-8">
          AI Interview Study Tool
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <StudyForm onSubmit={handleGenerate} loading={loading} />

          {loading && (
            <p className="text-center text-sm text-slate-500 mt-4">
              Generating interview material...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 mt-4">
              {error}
            </p>
          )}
        </div>

        <StudyResult data={data} studyParams={studyParams} />
      </div>
    </div>
  );
}
