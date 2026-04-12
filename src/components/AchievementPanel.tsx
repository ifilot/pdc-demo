import { achievements } from "../data/achievements";

interface AchievementPanelProps {
  unlockedIds: string[];
}

export function AchievementPanel({ unlockedIds }: AchievementPanelProps) {
  const unlockedSet = new Set(unlockedIds);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Achievements</p>
          <h2>Course milestones</h2>
        </div>
        <p className="panel-copy">
          Encourage steady progress through the roadmap with visible learning milestones.
        </p>
      </div>

      <div className="achievement-grid">
        {achievements.map((achievement) => {
          const unlocked = unlockedSet.has(achievement.id);

          return (
            <article
              key={achievement.id}
              className={`achievement-card ${unlocked ? "is-unlocked" : ""}`}
            >
              <div className="achievement-icon" aria-hidden="true">
                {unlocked ? "🏅" : "◌"}
              </div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <span className="achievement-state">
                {unlocked ? "Unlocked" : "Locked"}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
