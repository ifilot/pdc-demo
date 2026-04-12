import { Link } from "react-router-dom";

export function PrerequisitesPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <p className="eyebrow">Before You Start</p>
        <h1>Prerequisites</h1>
        <p className="hero-copy">
          This course is designed to be accessible, but students will get much more out of it if
          they begin with a few core ideas from chemical engineering, calculus, and basic Python.
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
            <p className="eyebrow">Expected Background</p>
            <h2>What students should already know</h2>
          </div>
          <p className="panel-copy">
            The course assumes a light foundation rather than deep control expertise.
          </p>
        </div>
        <div className="prereq-list">
          <article className="prereq-card">
            <h3>Chemical engineering basics</h3>
            <p>
              Students should already be comfortable with mass and energy balances, common unit
              operations, and the idea that process variables such as level, temperature, pressure,
              and concentration can change over time.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Mathematics</h3>
            <p>
              A working familiarity with algebra, simple differential equations, and reading graphs
              is enough for the placeholder material here. Comfort with rates of change and basic
              exponential behavior will help a lot.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Interpretation over memorization</h3>
            <p>
              Students do not need to arrive as control specialists. What matters most is the
              willingness to reason through process behavior, connect cause and effect, and reflect
              on why a controller should behave in a certain way.
            </p>
          </article>
        </div>
      </section>

      <section className="panel prereq-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Python Setup</p>
            <h2>What is needed for Python</h2>
          </div>
          <p className="panel-copy">
            The current site shows Python examples with syntax highlighting, but students do not
            need a complex environment just to follow the course.
          </p>
        </div>
        <div className="prereq-list">
          <article className="prereq-card">
            <h3>Minimum expectation</h3>
            <p>
              Students should be able to read small Python scripts, recognize variables, loops, and
              function calls, and understand printed output. Installing packages is not required for
              the current course flow.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Recommended environment</h3>
            <p>
              A simple local Python 3 installation is enough. If students want to experiment, a
              lightweight setup such as Python 3 with `venv`, VS Code, or Jupyter Notebook is a
              sensible starting point.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Good starter stack</h3>
            <p>
              A practical recommendation is Python 3.11 or later, a code editor, and optional
              scientific packages like `numpy`, `matplotlib`, and `scipy` if later exercises grow
              toward simulation or plotting.
            </p>
          </article>
        </div>
      </section>

      <section className="panel prereq-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Browser Requirements</p>
            <h2>What is needed in the browser</h2>
          </div>
          <p className="panel-copy">
            This course site is a modern JavaScript application, so students should use an up-to-date
            browser for the roadmap, quizzes, and progress features to work reliably.
          </p>
        </div>
        <div className="prereq-list">
          <article className="prereq-card">
            <h3>Recommended browsers</h3>
            <p>
              Recent versions of Chrome, Edge, Firefox, or Safari are all suitable. Using the latest
              stable version is the safest option for interactive features and page navigation.
            </p>
          </article>
          <article className="prereq-card">
            <h3>JavaScript and storage</h3>
            <p>
              JavaScript should be enabled, and the browser should allow local storage so progress,
              achievements, and imported course data can be saved in the device browser.
            </p>
          </article>
          <article className="prereq-card">
            <h3>Practical advice</h3>
            <p>
              If a page seems unresponsive after an update, refresh the browser once and make sure
              the student is not using a heavily outdated browser version from an older lab machine.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
