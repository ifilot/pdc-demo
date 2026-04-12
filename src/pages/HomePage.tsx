import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject, faFlask, faGlobe } from "@fortawesome/free-solid-svg-icons";

export function HomePage() {
  const highlights = [
    {
      icon: faGlobe,
      title: "Open education",
      description: "Accessible course material designed to support self-paced learning and easy sharing.",
    },
    {
      icon: faDiagramProject,
      title: "Structured roadmap",
      description: "A clear path from dynamic modeling fundamentals to applied feedback control topics.",
    },
    {
      icon: faFlask,
      title: "Chemical engineering focus",
      description: "Examples and topics framed around real process behavior, plant decisions, and control practice.",
    },
  ];

  return (
    <main className="page">
      <section className="hero landing-hero">
        <p className="eyebrow">An Open Course for Chemical Engineers</p>
        <h1>Process Dynamics and Control</h1>
        <p className="hero-copy">
          Explore core ideas in modeling, stability, and control at your own pace with open
          educational material designed to connect theory, process behavior, and applied decision
          making.
        </p>
        <div className="landing-actions">
          <Link className="primary-button" to="/learn">
            Start learning
          </Link>
          <Link className="secondary-button" to="/learning-goals">
            View learning goals
          </Link>
          <Link className="secondary-button" to="/prerequisites">
            Check prerequisites
          </Link>
        </div>
        <div className="hero-highlight-grid">
          {highlights.map((highlight) => (
            <article key={highlight.title} className="hero-highlight-card">
              <div className="hero-highlight-icon" aria-hidden="true">
                <FontAwesomeIcon icon={highlight.icon} />
              </div>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
