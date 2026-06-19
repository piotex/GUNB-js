import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} CzytnikCSV | Wersja 202605</p>
    </footer>
  );
};

export default Footer;
