import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LecturePage } from "./pages/LecturePage";
import { ModulePage } from "./pages/ModulePage";
import { LearnPage } from "./pages/LearnPage";
import { LearningGoalsPage } from "./pages/LearningGoalsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { PrerequisitesPage } from "./pages/PrerequisitesPage";
import { LearningProgressProvider } from "./hooks/useLearningProgress";
import { TopNav } from "./components/TopNav";

export function App() {
  const currentYear = new Date().getFullYear();

  return (
    <LearningProgressProvider>
      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learning-goals" element={<LearningGoalsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/prerequisites" element={<PrerequisitesPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/lecture/:lectureId" element={<LecturePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>© {currentYear} Process Dynamics and Control for Chemical Engineers.</p>
          <p>
            Developed as open educational material with acknowledgement to Eindhoven University of
            Technology (TU/e).
          </p>
        </div>
      </footer>
    </LearningProgressProvider>
  );
}
