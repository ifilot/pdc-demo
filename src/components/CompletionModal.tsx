interface CompletionModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  unlockedAchievementTitle?: string | null;
  nextTopics?: { id: string; name: string; href: string }[];
}

export function CompletionModal({
  open,
  title,
  onClose,
  unlockedAchievementTitle,
  nextTopics = [],
}: CompletionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="confirm-modal celebration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          aria-label="Close completion modal"
          onClick={onClose}
        >
          ×
        </button>
        <div className="celebration-ornaments" aria-hidden="true">
          <span className="spark spark-1" />
          <span className="spark spark-2" />
          <span className="spark spark-3" />
          <span className="spark spark-4" />
          <span className="spark spark-5" />
          <span className="spark spark-6" />
        </div>
        <div className="trophy-badge" aria-hidden="true">
          <span className="trophy-icon">🏆</span>
        </div>
        <p className="eyebrow">Topic Completed</p>
        <h2 id="completion-title">{title} completed</h2>
        <p className="panel-copy">
          Strong work. You have added another step to your Process Dynamics and Control roadmap.
        </p>
        {unlockedAchievementTitle && (
          <div className="achievement-toast">
            <span className="achievement-toast-icon" aria-hidden="true">
              ✦
            </span>
            Achievement unlocked: {unlockedAchievementTitle}
          </div>
        )}
        <p className="panel-copy">
          Keep the momentum going and continue with the next topic when you are ready.
        </p>
        {nextTopics.length > 0 && (
          <div className="next-topics">
            <p className="next-topics-label">Suggested next topics</p>
            <div className="next-topic-actions">
              {nextTopics.map((topic) => (
                <a
                  key={topic.id}
                  className="secondary-button"
                  href={topic.href}
                  onClick={onClose}
                >
                  {topic.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
