import React, { useState } from "react";
import { CHECKBOXES_YEARS, POSIBLE_ORGANS } from "../constants";

interface FileUploadProps {
  loading: boolean;
  selectedYears: string[];
  selectedStates: string[];
  onYearChange: (year: string) => void;
  onStateChange: (state: string) => void;
  onCheckAllYears: () => void;
  onClearAllYears: () => void;
  onCheckAllStates: () => void;
  onClearAllStates: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  loading,
  selectedYears,
  selectedStates,
  onYearChange,
  onStateChange,
  onCheckAllYears,
  onClearAllYears,
  onCheckAllStates,
  onClearAllStates,
  onFileUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  const processFile = (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      alert("Proszę wybrać plik CSV (.csv)");
      return;
    }

    // Update the hidden input with the file
    const input = document.getElementById("file-input") as HTMLInputElement;
    if (input) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      // Create a synthetic React event and call the handler directly
      const syntheticEvent = {
        target: input,
        currentTarget: input,
      } as React.ChangeEvent<HTMLInputElement>;

      onFileUpload(syntheticEvent);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're leaving the drop zone itself, not child elements
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  return (
    <div className="file-upload-container">
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        CzytnikCSV - Przeglądarka danych
      </h1>

      <h3 style={{ fontWeight: 700, marginBottom: "15px" }}>
        Wybierz rok/lata do pobrania z dokumentu:
        <button
          onClick={onCheckAllYears}
          className="btn btn-primary btn-sm"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={onClearAllYears}
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
      </h3>
      <div className="checkboxes-container">
        {CHECKBOXES_YEARS.map((year) => (
          <div key={year} className="checkbox-item">
            <input
              type="checkbox"
              id={`year_${year}`}
              checked={selectedYears.includes(year)}
              onChange={() => onYearChange(year)}
              disabled={loading}
            />
            <label htmlFor={`year_${year}`}>{year}</label>
          </div>
        ))}
      </div>
      <div style={{ height: "40px" }}></div>

      <h3 style={{ fontWeight: 700, marginBottom: "15px" }}>
        Wybierz województwo/województwa do pobrania z dokumentu:
        <button
          onClick={onCheckAllStates}
          className="btn btn-primary btn-sm"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={onClearAllStates}
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
      </h3>
      <div className="checkboxes-container">
        {Object.keys(POSIBLE_ORGANS).map((state) => (
          <div key={state} className="checkbox-item">
            <input
              type="checkbox"
              id={`state_${state}`}
              checked={selectedStates.includes(state)}
              onChange={() => onStateChange(state)}
              disabled={loading}
            />
            <label htmlFor={`state_${state}`}>{state}</label>
          </div>
        ))}
      </div>
      <div style={{ height: "40px" }}></div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          style={{ display: "none" }}
          type="file"
          id="file-input"
          accept=".csv"
          onChange={onFileUpload}
        />
        <div
          className={`custom-file-upload ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          📁 Przeciągnij tutaj plik CSV
          <br />
          <span style={{ fontSize: "18px" }}>lub kliknij aby wybrać</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
