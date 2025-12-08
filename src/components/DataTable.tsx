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
    <div className="table-container">
      <table className="table table-striped">
        <thead>
          <tr>
            {visibleColumns.map((header) => (
              <th
                key={header}
                onClick={() => handleSort(header)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {header}
                {sortColumn === header && (
                  <span style={{ marginLeft: "5px" }}>
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => (
            <tr key={index}>
              {visibleColumns.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
