import React from "react";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Ładowanie danych...",
}) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
