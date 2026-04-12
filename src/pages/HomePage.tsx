import { Link } from "react-router-dom";
import { AchievementPanel } from "../components/AchievementPanel";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function HomePage() {
  const { unlockedAchievementIds } = useLearningProgress();

  return (
    <main className="page">
      <section className="hero landing-hero">
        <p className="eyebrow">Process Dynamics and Control</p>
        <h1>Learn how dynamic processes behave and how to control them well</h1>
        <p className="hero-copy">
          This course introduces chemical engineering students to process modeling, feedback
          control, loop performance, and practical control decisions. The material is organized as
          a guided roadmap so students can see how foundational ideas support applied control work.
        </p>
        <div className="landing-actions">
          <Link className="primary-button" to="/learn">
            Start learning
          </Link>
        </div>
      </section>

      <AchievementPanel unlockedIds={unlockedAchievementIds} />
    </main>
  );
}
