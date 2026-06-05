import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  hasData: boolean;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ hasData, onHomeClick }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          style={{ textDecoration: "none" }}
          onClick={onHomeClick}
        >
          <h1>CzytnikCSV</h1>
          <span className="navbar-subtitle">Przeglądarka danych CSV</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={onHomeClick}
          >
            Start
          </Link>
          <Link
            to="/data"
            className={`nav-link ${
              location.pathname === "/data" ? "active" : ""
            }`}
            onClick={(e) => {
              if (!hasData) {
                e.preventDefault();
              }
            }}
            style={{
              opacity: hasData ? 1 : 0.5,
              cursor: hasData ? "pointer" : "not-allowed",
              pointerEvents: hasData ? "auto" : "none",
            }}
          >
            Dane
          </Link>
          <Link
            to="/about"
            className={`nav-link ${
              location.pathname === "/about" ? "active" : ""
            }`}
          >
            Instrukcja
          </Link>
          <Link
            to="/terms"
            className={`nav-link ${
              location.pathname === "/terms" ? "active" : ""
            }`}
          >
            Regulamin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
