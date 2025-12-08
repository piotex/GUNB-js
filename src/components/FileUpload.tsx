import React from "react";
import { CHECKBOXES_YEARS, POSIBLE_ORGANS } from "../constants";

interface FileUploadProps {
  loading: boolean;
  selectedYears: string[];
  selectedStates: string[];
  onYearChange: (year: string) => void;
  onStateChange: (state: string) => void;
  onCheckAllYears: () => void;
  onCheckAllStates: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  loading,
  selectedYears,
  selectedStates,
  onYearChange,
  onStateChange,
  onCheckAllYears,
  onCheckAllStates,
  onFileUpload,
}) => {
  return (
    <div className="file-upload-container">
      <h3 style={{ fontWeight: 700 }}>
        Wybierz rok/lata do pobrania z dokumentu:
        <button
          onClick={onCheckAllYears}
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
      </h3>
      <div style={{ height: "10px" }}></div>
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
      <div style={{ height: "50px" }}></div>

      <h3 style={{ fontWeight: 700 }}>
        Wybierz województwo/województwa do pobrania z dokumentu:
        <button
          onClick={onCheckAllStates}
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
      </h3>
      <div style={{ height: "10px" }}></div>
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
      <div style={{ height: "50px" }}></div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <input
            style={{ display: "none" }}
            type="file"
            id="file-input"
            accept=".csv"
            onChange={onFileUpload}
          />
          <label htmlFor="file-input" className="custom-file-upload">
            Przeciągnij tutaj plik CSV
            <br />
            lub kliknij aby wybrać
          </label>
        </>
      )}
    </div>
  );
};

export default FileUpload;
