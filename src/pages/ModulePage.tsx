import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CompletionModal } from "../components/CompletionModal";
import { achievements, getUnlockedAchievementIds } from "../data/achievements";
import {
  getLectureContent,
  getModuleById,
  getNextAccessibleModuleIds,
  leafModuleIds,
} from "../data/sqlTree";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { completedIds, isCompleted, toggleCompleted } = useLearningProgress();
  const [activeTab, setActiveTab] = useState<"theory" | "summary">("theory");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState<string | null>(null);
  const [nextTopics, setNextTopics] = useState<{ id: string; name: string; href: string }[]>([]);

  if (!moduleId) {
    return <Navigate to="/" replace />;
  }

  const module = getModuleById(moduleId);
  if (!module) {
    return <Navigate to="/" replace />;
  }

  const lecture = getLectureContent(module.id);
  const isLeafLecture = leafModuleIds.has(module.id) && Boolean(lecture);
  const completed = isCompleted(module.id);
  const visibleNextTopics = completed
    ? getNextAccessibleModuleIds(completedIds, module.id).map((id) => {
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
        <p className="eyebrow">{module.type} module</p>
        <h1>{module.name}</h1>
        <p className="hero-copy">{module.description}</p>

        <div className="meta-row">
          <span className={completed ? "status-pill completed-pill" : "status-pill"}>
            {completed ? "Completed 🏆" : "In progress"}
          </span>
          <span>{module.type === "concept" ? "Theory topic" : "Applied topic"}</span>
        </div>
      </section>

      <section className="tab-shell">
        <div className="tab-panel">
          <div className="tab-bar" role="tablist" aria-label="Module content">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "theory"}
              className={`tab-button ${activeTab === "theory" ? "is-active" : ""}`}
              onClick={() => setActiveTab("theory")}
            >
              Theory
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "summary"}
              className={`tab-button ${activeTab === "summary" ? "is-active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "theory" && (
              <div className="content-prose">
                <h2>Theory</h2>
                <p>{module.description}</p>
                <p>
                  {module.type === "concept"
                    ? "This theory topic builds the conceptual language students need before they tackle controller decisions and practical loop evaluation."
                    : "This applied topic focuses on using the underlying control ideas in realistic engineering judgments and course exercises."}
                </p>
                <p>
                  {isLeafLecture
                    ? "Because this topic sits at the end of the current branch, it also includes a lecture page for a more focused walkthrough."
                    : "Use this page as a compact topic overview before continuing through the roadmap."}
                </p>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="content-prose">
                <h2>Summary</h2>
                <p>{module.name} is part of the Process Dynamics and Control learning path.</p>
                <p>
                  Key takeaway: students should understand what this topic contributes to process modeling, feedback reasoning, or control performance evaluation.
                </p>
                <p>
                  {isLeafLecture
                    ? "Next step: open the lecture to review the topic in a more guided format."
                    : "Next step: return to the roadmap and continue with the connected topics."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="lecture-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            if (!completed) {
              const nextCompletedIds = [...completedIds, module.id];
              const currentAchievements = new Set(getUnlockedAchievementIds(completedIds));
              const nextAchievementId = getUnlockedAchievementIds(nextCompletedIds).find(
                (id) => !currentAchievements.has(id),
              );
              const suggestedNextTopics = getNextAccessibleModuleIds(nextCompletedIds, module.id).map((id) => {
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
            toggleCompleted(module.id);
          }}
        >
          {completed ? "Mark as incomplete" : "Mark as complete"}
        </button>
        {isLeafLecture && (
          <a className="primary-button" href={`${import.meta.env.BASE_URL}#/lecture/${module.id}`}>
            Open lecture
          </a>
        )}
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
        title={module.name}
        unlockedAchievementTitle={newAchievementTitle}
        nextTopics={nextTopics}
        onClose={() => setShowCompletionModal(false)}
      />
    </main>
  );
}
