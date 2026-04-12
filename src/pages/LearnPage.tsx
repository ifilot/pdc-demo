import { useState } from "react";
import { Link } from "react-router-dom";
import { CourseRoadmap } from "../components/SqlSkillTree";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function LearnPage() {
  const { resetProgress } = useLearningProgress();
  const [showResetWarning, setShowResetWarning] = useState(false);

  return (
    <main className="page">
      <section className="hero compact-hero">
        <p className="eyebrow">Learning Map</p>
        <h1>Process Dynamics and Control roadmap</h1>
        <p className="hero-copy">
          Follow the prerequisite structure from process fundamentals to applied control topics.
          Terminal nodes open lecture pages for focused review.
        </p>
        <div className="landing-actions">
          <Link className="secondary-button" to="/">
            Back to overview
          </Link>
        </div>
      </section>

      <section className="panel">
        <CourseRoadmap />
        <div className="roadmap-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowResetWarning(true)}
          >
            Reset course progress
          </button>
        </div>
      </section>

      {showResetWarning && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowResetWarning(false)}>
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-progress-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Warning</p>
            <h2 id="reset-progress-title">Reset course progress?</h2>
            <p className="panel-copy">
              This will restore the default course state and remove the completion changes you made in this browser.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowResetWarning(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  resetProgress();
                  setShowResetWarning(false);
                }}
              >
                Reset progress
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
