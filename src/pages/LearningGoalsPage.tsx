import { Link } from "react-router-dom";

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
          <article className="prereq-card">
            <h3>Interpret dynamic process behavior</h3>
            <p>
              Understand why process variables respond over time, recognize common transient
              patterns, and explain what those responses mean for physical systems.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Work with simple dynamic models</h3>
            <p>
              Relate first-principles thinking and simple model forms to process behavior, time
              constants, gains, and delays that appear in control analysis.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Reason about feedback control</h3>
            <p>
              Explain the role of feedback, compare controller actions, and judge how control
              choices influence disturbance rejection and setpoint tracking.
            </p>
          </article>
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
          <article className="prereq-card">
            <h3>Communicate clearly about control problems</h3>
            <p>
              Describe process-control issues using the right vocabulary and connect engineering
              observations to model-based explanations.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Approach tuning and performance more thoughtfully</h3>
            <p>
              Build the intuition needed to judge whether a loop is sluggish, oscillatory, robust,
              or sensitive, and what adjustments might improve it.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Bridge theory and chemical engineering practice</h3>
            <p>
              Connect equations and diagrams to practical decisions in reactors, separators, heat
              exchangers, and other process systems.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
