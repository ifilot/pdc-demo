import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LecturePage } from "./pages/LecturePage";
import { ModulePage } from "./pages/ModulePage";
import { LearnPage } from "./pages/LearnPage";
import { LearningProgressProvider } from "./hooks/useLearningProgress";
import { TopNav } from "./components/TopNav";

export function App() {
  return (
    <LearningProgressProvider>
      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/lecture/:lectureId" element={<LecturePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LearningProgressProvider>
  );
}
