import { Link } from "react-router-dom";
import { AchievementPanel } from "../components/AchievementPanel";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function ProgressPage() {
  const { unlockedAchievementIds } = useLearningProgress();

  return (
    <main className="page">
      <section className="hero compact-hero">
        <p className="eyebrow">Track Your Journey</p>
        <h1>Progress</h1>
        <p className="hero-copy">
          Follow your course milestones and see which achievements you have already unlocked while
          moving through the roadmap.
        </p>
        <div className="landing-actions">
          <Link className="primary-button" to="/learn">
            Go to topics
          </Link>
        </div>
      </section>

      <AchievementPanel unlockedIds={unlockedAchievementIds} />
    </main>
  );
}
