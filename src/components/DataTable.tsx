import React, { useState } from "react";
import { DataRow } from "../types";

interface DataTableProps {
  data: DataRow[];
  headers: string[];
  selectedColumns: string[];
  maxElements: number;
}

type SortDirection = "asc" | "desc" | null;

const DataTable: React.FC<DataTableProps> = ({
  data,
  headers,
  selectedColumns,
  maxElements,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: string) => {
    let newDirection: SortDirection = "asc";

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      }
    }

    setSortColumn(newDirection ? column : null);
    setSortDirection(newDirection);
  };

  const getSortedData = (): DataRow[] => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]?.toLowerCase() || "";
      const bVal = b[sortColumn]?.toLowerCase() || "";

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  };

  const sortedData = getSortedData();
  const displayData = sortedData.slice(0, maxElements);
  const visibleColumns = headers.filter((h) => selectedColumns.includes(h));

  return (
    <>
      {data.length > maxElements && (
        <div
          style={{
            padding: "10px 15px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          ⚠️ Wyświetlanie {displayData.length} z {data.length} wierszy
        </div>
      )}
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              {visibleColumns.map((header, colIndex) => (
                <th
                  key={`th_${colIndex}_${header}`}
                  onClick={() => handleSort(header)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Kliknij aby posortować"
                >
                  {header}
                  {sortColumn === header && (
                    <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {visibleColumns.map((header, colIndex) => (
                    <td key={`td_${rowIndex}_${colIndex}`}>{row[header]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  Brak danych do wyświetlenia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
