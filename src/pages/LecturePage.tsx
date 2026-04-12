import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CompletionModal } from "../components/CompletionModal";
import { MathContent } from "../components/MathContent";
import { achievements, getUnlockedAchievementIds } from "../data/achievements";
import {
  getLectureContent,
  getModuleById,
  getNextAccessibleModuleIds,
  leafModuleIds,
} from "../data/sqlTree";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { completedIds, isCompleted, toggleCompleted } = useLearningProgress();
  const [activeTab, setActiveTab] = useState<"theory" | "summary">("theory");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState<string | null>(null);
  const [nextTopics, setNextTopics] = useState<{ id: string; name: string; href: string }[]>([]);

  if (!lectureId) {
    return <Navigate to="/" replace />;
  }

  const node = getModuleById(lectureId);
  const lecture = getLectureContent(lectureId);
  const canRenderLecture = node && leafModuleIds.has(node.id) && lecture;

  if (!canRenderLecture) {
    return <Navigate to="/" replace />;
  }

  const completed = isCompleted(node.id);
  const visibleNextTopics = completed
    ? getNextAccessibleModuleIds(completedIds, node.id).map((id) => {
        const nextModule = getModuleById(id)!;
        const isLecture = leafModuleIds.has(id) && Boolean(getLectureContent(id));
        return {
          id,
          name: nextModule.name,
          href: `${import.meta.env.BASE_URL}#${isLecture ? `/lecture/${id}` : `/module/${id}`}`,
        };
      })
    : [];

  return (
    <main className="page">
      <a className="back-link" href={`${import.meta.env.BASE_URL}#/`}>
        Back to overview
      </a>

      <section className="lecture-hero">
        <p className="eyebrow">{node.type} lecture</p>
        <h1>{node.name}</h1>
        <p className="hero-copy">{node.description}</p>

        <div className="meta-row">
          <span>{lecture.duration}</span>
          <span>{lecture.level}</span>
          <span className={completed ? "status-pill completed-pill" : "status-pill"}>
            {completed ? "Completed 🏆" : "Terminal course topic"}
          </span>
        </div>
      </section>

      <section className="tab-shell">
        <div className="tab-panel">
          <div className="tab-bar" role="tablist" aria-label="Lecture content">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "theory"}
              className={`tab-button ${activeTab === "theory" ? "is-active" : ""}`}
              onClick={() => setActiveTab("theory")}
            >
              ◧ Theory
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "summary"}
              className={`tab-button ${activeTab === "summary" ? "is-active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              ≡ Summary
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "theory" &&
              lecture.sections.map((section) => (
                <article key={section.heading} className="content-section">
                  <h2>{section.heading}</h2>
                  <MathContent paragraphs={[section.body]} />
                </article>
              ))}

            {activeTab === "summary" && (
              <div className="content-prose">
                <h2>Summary</h2>
                <MathContent paragraphs={lecture.summary} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="lecture-actions">
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (!completed) {
              const nextCompletedIds = [...completedIds, node.id];
              const currentAchievements = new Set(getUnlockedAchievementIds(completedIds));
              const nextAchievementId = getUnlockedAchievementIds(nextCompletedIds).find(
                (id) => !currentAchievements.has(id),
              );
              const suggestedNextTopics = getNextAccessibleModuleIds(nextCompletedIds, node.id).map((id) => {
                const nextModule = getModuleById(id)!;
                const isLecture = leafModuleIds.has(id) && Boolean(getLectureContent(id));
                return {
                  id,
                  name: nextModule.name,
                  href: `${import.meta.env.BASE_URL}#${isLecture ? `/lecture/${id}` : `/module/${id}`}`,
                };
              });
              setNewAchievementTitle(
                achievements.find((achievement) => achievement.id === nextAchievementId)?.title ?? null,
              );
              setNextTopics(suggestedNextTopics);
              setShowCompletionModal(true);
            } else {
              setNewAchievementTitle(null);
              setNextTopics([]);
            }
            toggleCompleted(node.id);
          }}
        >
          {completed ? "Mark as incomplete" : "Mark lecture as complete"}
        </button>
      </section>

      {visibleNextTopics.length > 0 && (
        <section className="panel next-topics-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Next Topics</p>
              <h2>Continue the roadmap</h2>
            </div>
            <p className="panel-copy">
              These topics are now accessible based on your completed work.
            </p>
          </div>
          <div className="next-topic-actions">
            {visibleNextTopics.map((topic) => (
              <a key={topic.id} className="secondary-button" href={topic.href}>
                {topic.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <CompletionModal
        open={showCompletionModal}
        title={node.name}
        unlockedAchievementTitle={newAchievementTitle}
        nextTopics={nextTopics}
        onClose={() => setShowCompletionModal(false)}
      />
    </main>
  );
}
