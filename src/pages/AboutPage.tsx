import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <p className="eyebrow">About This Course</p>
        <h1>About</h1>
        <p className="hero-copy">
          This website is being developed as an open educational environment for Process Dynamics
          and Control in chemical engineering.
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
            <p className="eyebrow">Purpose</p>
            <h2>Why this site exists</h2>
          </div>
          <p className="panel-copy">
            The course is meant to support self-study, classroom use, and open access to core ideas
            in process dynamics and control.
          </p>
        </div>
        <div className="prereq-list">
          <article className="prereq-card">
            <h3>Open educational intent</h3>
            <p>
              The site is designed as accessible educational material that helps students build
              understanding at their own pace through a guided roadmap of theory, summaries, and
              checkpoints.
            </p>
          </article>
          <article className="prereq-card">
            <h3>For chemical engineers</h3>
            <p>
              The examples, language, and learning path are framed around chemical engineering
              systems, with an emphasis on process behavior, modeling intuition, and control
              decisions.
            </p>
          </article>
          <article className="prereq-card">
            <h3>For learning and teaching</h3>
            <p>
              The platform is intended to work both as a student-facing course experience and as a
              teaching support environment for modules, checkpoints, and open course development.
            </p>
          </article>
        </div>
      </section>

      <section className="panel prereq-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Acknowledgements</p>
            <h2>Credits and inspiration</h2>
          </div>
          <p className="panel-copy">
            This project builds on open educational ideas and acknowledges important sources of
            inspiration.
          </p>
        </div>
        <div className="prereq-list">
          <article className="prereq-card">
            <h3>Eindhoven University of Technology</h3>
            <p>
              This course is developed as open educational material with acknowledgement to
              Eindhoven University of Technology (TU/e).
            </p>
          </article>
          <article className="prereq-card">
            <h3>Inspired by SQL Valley</h3>
            <p>
              The structure and learning experience of this site were inspired by SQL Valley,
              created by Hildo Bijl.
            </p>
            <p>
              Visit{" "}
              <a href="https://sqlvalley.com" target="_blank" rel="noreferrer">
                sqlvalley.com
              </a>
              .
            </p>
          </article>
          <article className="prereq-card">
            <h3>Course direction</h3>
            <p>
              This platform is evolving into a Process Dynamics and Control environment, so the
              current structure can grow further into richer modules, checkpoints, achievements,
              and topic-based navigation tailored to the course.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
