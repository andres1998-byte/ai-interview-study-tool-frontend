import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudyPage from "./pages/StudyPage";
import InterviewPage from "./pages/InterviewPage";
import CodeChallengePage from "./pages/CodeChallengePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <Navbar />

        <Routes>
          <Route path="/" element={<StudyPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/code" element={<CodeChallengePage />} />
        </Routes>
      </div>
    </div>
  );
}
