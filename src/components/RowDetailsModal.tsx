import React from "react";
import { DataRow } from "../types";

interface RowDetailsModalProps {
  isOpen: boolean;
  row: DataRow | null;
  headers: string[];
  onClose: () => void;
}

const RowDetailsModal: React.FC<RowDetailsModalProps> = ({
  isOpen,
  row,
  headers,
  onClose,
}) => {
  if (!isOpen || !row) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Szczegóły wiersza</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {headers.map((header, index) => (
            <div key={index} className="modal-row">
              <div className="modal-label">{header}:</div>
              <div className="modal-value">{row[header] || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RowDetailsModal;
