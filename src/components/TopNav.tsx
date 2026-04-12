import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useLearningProgress } from "../hooks/useLearningProgress";

const navItems = [
  { to: "/", label: "Home", icon: faHouse },
  { to: "/learn", label: "Topics", icon: faBookOpen },
];

export function TopNav() {
  const location = useLocation();
  const { resetProgress } = useLearningProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link className="top-nav-brand" to="/">
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
                Home
              </Link>
              <Link
                className="top-nav-menu-item"
                to="/learn"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                Topics
              </Link>
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
                Reset progress
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
