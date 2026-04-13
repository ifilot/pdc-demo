import { type ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBookOpen,
  faDownload,
  faFileArrowUp,
  faFileCode,
  faFileLines,
  faGear,
  faGraduationCap,
  faHouse,
  faListCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useLearningProgress } from "../hooks/useLearningProgress";

const navItems = [
  { to: "/", label: "Home", icon: faHouse },
  { to: "/about", label: "About", icon: faCircleInfo },
  { to: "/learning-goals", label: "Learning goals", icon: faGraduationCap },
  { to: "/progress", label: "Progress", icon: faTrophy },
  { to: "/prerequisites", label: "Prerequisites", icon: faListCheck },
  { to: "/learn", label: "Topics", icon: faBookOpen },
];

export function TopNav() {
  const location = useLocation();
  const { resetProgress, exportProgressJson, exportProgressYaml, importProgressFile } =
    useLearningProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await importProgressFile(file);
      window.alert("Progress imported successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to import this progress file.";
      window.alert(message);
    } finally {
      event.target.value = "";
      setMenuOpen(false);
    }
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link className="top-nav-brand" to="/">
          <img
            className="top-nav-brand-mark"
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            aria-hidden="true"
          />
          Process Dynamics and Control
        </Link>

        <nav className="top-nav-links" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== "/" && location.pathname.startsWith(`${item.to}/`));

            return (
              <Link
                key={item.to}
                className={`top-nav-link ${isActive ? "is-active" : ""}`}
                to={item.to}
              >
                <span className="top-nav-link-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="top-nav-actions">
          <button
            type="button"
            className="top-nav-settings"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>

          {menuOpen && (
            <div className="top-nav-menu" role="menu">
              <Link className="top-nav-menu-item" to="/" role="menuitem" onClick={() => setMenuOpen(false)}>
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                Home
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/about"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCircleInfo} />
                </span>
                About
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/learning-goals"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </span>
                Learning goals
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/progress"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTrophy} />
                </span>
                Progress
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/prerequisites"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faListCheck} />
                </span>
                Prerequisites
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/learn"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBookOpen} />
                </span>
                Topics
              </Link>
              <button
                type="button"
                className="top-nav-menu-item top-nav-menu-button"
                role="menuitem"
                onClick={() => {
                  exportProgressJson();
                  setMenuOpen(false);
                }}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFileCode} />
                </span>
                Export progress as JSON
              </button>
              <button
                type="button"
                className="top-nav-menu-item top-nav-menu-button"
                role="menuitem"
                onClick={() => {
                  exportProgressYaml();
                  setMenuOpen(false);
                }}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFileLines} />
                </span>
                Export progress as YAML
              </button>
              <label className="top-nav-menu-item top-nav-menu-upload" role="menuitem">
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFileArrowUp} />
                </span>
                Import progress file
                <input
                  type="file"
                  accept=".json,.yaml,.yml,application/json,application/yaml,text/yaml,text/plain"
                  onChange={handleImport}
                />
              </label>
              <button
                type="button"
                className="top-nav-menu-item top-nav-menu-button"
                role="menuitem"
                onClick={() => {
                  const confirmed = window.confirm("Reset all course progress in this browser?");
                  if (confirmed) {
                    resetProgress();
                  }
                  setMenuOpen(false);
                }}
              >
                <span className="top-nav-menu-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faDownload} />
                </span>
                Reset progress
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
