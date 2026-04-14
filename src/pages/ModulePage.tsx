import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CompletionModal } from "../components/CompletionModal";
import { RichContent } from "../components/RichContent";
import { achievements, getUnlockedAchievementIds } from "../data/achievements";
import {
  getModuleById,
  getModuleContent,
  getLearningGoalsForModule,
  getNextAccessibleModuleIds,
  isQuestionAnswerCorrect,
} from "../data/sqlTree";
import { useLearningProgress } from "../hooks/useLearningProgress";

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const {
    completedIds,
    isCompleted,
    toggleCompleted,
    getQuestionAnswer,
    setQuestionAnswer,
  } = useLearningProgress();
  const [activeTab, setActiveTab] = useState<"theory" | "checkpoint" | "summary">("theory");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState<string | null>(null);
  const [nextTopics, setNextTopics] = useState<{ id: string; name: string; href: string }[]>([]);
  const [questionStatus, setQuestionStatus] = useState<Record<string, "correct" | "incorrect">>({});
  const [hasCheckedAnswers, setHasCheckedAnswers] = useState(false);

  if (!moduleId) {
    return <Navigate to="/" replace />;
  }

  const module = getModuleById(moduleId);
  if (!module) {
    return <Navigate to="/" replace />;
  }

  const moduleContent = getModuleContent(module.id);
  const learningGoals = getLearningGoalsForModule(module.id);
  const completed = isCompleted(module.id);
  const questions = moduleContent?.questions ?? [];
  const allQuestionsAnswered = questions.every((question) => getQuestionAnswer(question.id).trim().length > 0);
  const allQuestionsCorrect =
    questions.length === 0 || questions.every((question) => questionStatus[question.id] === "correct");
  const visibleNextTopics = completed
    ? getNextAccessibleModuleIds(completedIds, module.id).map((id) => {
        const nextModule = getModuleById(id)!;
        return {
          id,
          name: nextModule.name,
          href: `${import.meta.env.BASE_URL}#/module/${id}`,
        };
      })
    : [];

  useEffect(() => {
    setActiveTab("theory");
    setQuestionStatus({});
    setHasCheckedAnswers(false);
  }, [module.id]);

  function handleCheckAnswers() {
    const nextStatus = Object.fromEntries(
      questions.map((question) => [
        question.id,
        isQuestionAnswerCorrect(question, getQuestionAnswer(question.id)) ? "correct" : "incorrect",
      ]),
    ) as Record<string, "correct" | "incorrect">;

    setQuestionStatus(nextStatus);
    setHasCheckedAnswers(true);
  }

  function handleToggleCompleted() {
    if (!completed && questions.length > 0 && !allQuestionsCorrect) {
      return;
    }
    if (!completed) {
      const nextCompletedIds = [...completedIds, module.id];
      const currentAchievements = new Set(getUnlockedAchievementIds(completedIds));
      const nextAchievementId = getUnlockedAchievementIds(nextCompletedIds).find(
        (id) => !currentAchievements.has(id),
      );
      const suggestedNextTopics = getNextAccessibleModuleIds(nextCompletedIds, module.id).map((id) => {
        const nextModule = getModuleById(id)!;
        return {
          id,
          name: nextModule.name,
          href: `${import.meta.env.BASE_URL}#/module/${id}`,
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
  }

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
          <span>{module.type === "concept" ? "◧ Theory topic" : "⚙ Applied topic"}</span>
        </div>
      </section>

      {learningGoals.length > 0 && (
        <section className="panel next-topics-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Learning Goals</p>
              <h2>What this module supports</h2>
            </div>
            <p className="panel-copy">
              This module contributes to the following course-level learning goals.
            </p>
          </div>
          <div className="prereq-list">
            {learningGoals.map((goal) => (
              <article key={goal.id} className="prereq-card">
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

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
            {questions.length > 0 && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "checkpoint"}
                className={`tab-button ${activeTab === "checkpoint" ? "is-active" : ""}`}
                onClick={() => setActiveTab("checkpoint")}
              >
                ✓ Checkpoint
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === "theory" && (
              <div className="content-prose">
                <h2>Theory</h2>
                <RichContent
                  blocks={moduleContent?.theory ?? [{ type: "paragraph", text: module.description }]}
                />
                {questions.length > 0 && (
                  <div className="theory-next-action">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setActiveTab("summary")}
                    >
                      Go to Summary
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setActiveTab("checkpoint")}
                    >
                      Go to Questions
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "summary" && (
              <div className="content-prose">
                <h2>Summary</h2>
                <RichContent
                  blocks={
                    moduleContent?.summary ?? [
                      {
                        type: "paragraph",
                        text: `${module.name} is part of the Process Dynamics and Control learning path.`,
                      },
                    ]
                  }
                />
                {questions.length > 0 && (
                  <div className="theory-next-action">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setActiveTab("checkpoint")}
                    >
                      Go to Questions
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "checkpoint" && questions.length > 0 && (
              <div className="question-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Checkpoint</p>
                    <h2>Answer before completing</h2>
                  </div>
                  <p className="panel-copy">
                    Fill in these short reflections to mark this module as complete.
                  </p>
                </div>
                <div className="question-list">
                  {questions.map((question, index) => (
                    <article key={question.id} className="question-card">
                      <label className="question-label" htmlFor={question.id}>
                        {index + 1}. {question.prompt}
                      </label>
                      {question.helpText && <p className="question-help">{question.helpText}</p>}
                      <textarea
                        id={question.id}
                        className={`question-input ${
                          questionStatus[question.id] ? `is-${questionStatus[question.id]}` : ""
                        }`}
                        rows={4}
                        value={getQuestionAnswer(question.id)}
                        placeholder={question.placeholder}
                        onChange={(event) => {
                          setQuestionAnswer(question.id, event.target.value);
                          setQuestionStatus((currentStatus) => {
                            if (!currentStatus[question.id]) {
                              return currentStatus;
                            }
                            const nextStatus = { ...currentStatus };
                            delete nextStatus[question.id];
                            return nextStatus;
                          });
                          setHasCheckedAnswers(false);
                        }}
                      />
                      {questionStatus[question.id] === "correct" && (
                        <p className="question-feedback is-correct">Answer looks good.</p>
                      )}
                      {questionStatus[question.id] === "incorrect" && (
                        <p className="question-feedback is-incorrect">Hint: {question.hint}</p>
                      )}
                    </article>
                  ))}
                </div>
                <div className="question-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={!allQuestionsAnswered}
                    onClick={handleCheckAnswers}
                  >
                    Check answers
                  </button>
                  <button
                    type="button"
                    className={`secondary-button ${
                      !completed && questions.length > 0 && allQuestionsCorrect
                        ? "completion-button-ready"
                        : ""
                    }`}
                    disabled={!completed && questions.length > 0 && !allQuestionsCorrect}
                    onClick={handleToggleCompleted}
                  >
                    {completed ? "Mark as incomplete" : "Mark as complete"}
                  </button>
                  {hasCheckedAnswers && allQuestionsCorrect && (
                    <p className="question-summary is-correct">All checkpoint answers are correct.</p>
                  )}
                  {hasCheckedAnswers && !allQuestionsCorrect && (
                    <p className="question-summary is-incorrect">
                      Some answers still need work. Use the hints and try again.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {!completed && questions.length > 0 && !allQuestionsAnswered && (
        <p className="completion-note">
          Complete all checkpoint answers before checking them.
        </p>
      )}

      {!completed && questions.length > 0 && allQuestionsAnswered && !allQuestionsCorrect && (
        <p className="completion-note">
          Use the check button and correct any flagged answers before this topic can be marked as complete.
        </p>
      )}

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
