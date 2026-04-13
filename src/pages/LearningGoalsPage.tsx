import { Link } from "react-router-dom";
import { learningGoals } from "../data/sqlTree";

export function LearningGoalsPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <p className="eyebrow">Course Outcomes</p>
        <h1>Learning goals</h1>
        <p className="hero-copy">
          At the end of this course, you have learned how to interpret process behavior, connect
          dynamic models to engineering decisions, and reason about feedback control with more
          confidence.
        </p>
        <div className="landing-actions">
          <Link className="primary-button" to="/learn">
            Go to topics
          </Link>
        </div>
      </section>

      <section className="panel prereq-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">At the end of this course, you have learned</p>
            <h2>What students should be able to do</h2>
          </div>
          <p className="panel-copy">
            The learning goals combine conceptual understanding with practical interpretation.
          </p>
        </div>
        <div className="prereq-list">
          {learningGoals.slice(0, 3).map((goal) => (
            <article key={goal.id} className="prereq-card">
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel prereq-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Practical outcome</p>
            <h2>What this prepares students for</h2>
          </div>
          <p className="panel-copy">
            The course is meant to support later work in process control, simulation, and plant
            decision-making.
          </p>
        </div>
        <div className="prereq-list">
          {learningGoals.slice(3).map((goal) => (
            <article key={goal.id} className="prereq-card">
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
