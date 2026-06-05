import React, { useState, useEffect } from "react";
import { DataRow } from "../types";
import RowDetailsModal from "./RowDetailsModal";
import LoadingOverlay from "./LoadingOverlay";

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
  const dateHeaders = new Set([
    "data_wplywu_wniosku",
    "data_wplywu_wniosku_do_urzedu",
    "data_wydania_decyzji",
  ]);

  const parseDateString = (s: string | undefined | null): Date | null => {
    if (!s) return null;
    const t = s.toString().trim();
    if (!t) return null;
    const iso = t.slice(0, 10);
    if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(iso)) return new Date(iso);
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(iso)) {
      const parts = iso.split(".");
      const dd = parts[0];
      const mm = parts[1];
      const yyyy = parts[2];
      return new Date(`${yyyy}-${mm}-${dd}`);
    }
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatEuropean = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortedData, setSortedData] = useState<DataRow[]>(data);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSort = (column: string) => {
    let newDirection: SortDirection = "asc";

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      }
    }

    setLoading(true);
    setSortColumn(newDirection ? column : null);
    setSortDirection(newDirection);
  };

  const handleRowClick = (row: DataRow) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const performSort = () => {
      if (!sortColumn || !sortDirection) {
        setSortedData(data);
        setLoading(false);
        return;
      }

      const sorted = [...data].sort((a, b) => {
        const aVal = a[sortColumn]?.toLowerCase() || "";
        const bVal = b[sortColumn]?.toLowerCase() || "";

        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });

      setSortedData(sorted);
      setLoading(false);
    };

    if (loading) {
      setTimeout(performSort, 100);
    } else {
      performSort();
    }
  }, [sortColumn, sortDirection, data, loading]);

  const totalPages = Math.ceil(sortedData.length / maxElements);
  const startIndex = currentPage * maxElements;
  const endIndex = startIndex + maxElements;
  const displayData = sortedData.slice(startIndex, endIndex);
  const visibleColumns = headers.filter((h) => selectedColumns.includes(h));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageButtons = () => {
    const buttons = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage < 4) {
        for (let i = 0; i < 5; i++) buttons.push(i);
        buttons.push(-1); // ellipsis
        buttons.push(totalPages - 1);
      } else if (currentPage >= totalPages - 4) {
        buttons.push(0);
        buttons.push(-1);
        for (let i = totalPages - 5; i < totalPages; i++) buttons.push(i);
      } else {
        buttons.push(0);
        buttons.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          buttons.push(i);
        buttons.push(-1);
        buttons.push(totalPages - 1);
      }
    }
    return buttons;
  };

  return (
    <>
      {loading && <LoadingOverlay message="Sortowanie danych..." />}

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Wyświetlanie wierszy {startIndex + 1}-
            {Math.min(endIndex, sortedData.length)} z {sortedData.length}
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ‹ Poprzednia
            </button>

            {getPageButtons().map((page, index) =>
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page * maxElements + 1}-
                  {Math.min((page + 1) * maxElements, sortedData.length)}
                </button>
              )
            )}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Następna ›
            </button>
          </div>
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
                  style={{ cursor: "pointer", userSelect: "text" }}
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
                <tr
                  key={rowIndex}
                  onClick={() => handleRowClick(row)}
                  style={{ cursor: "pointer" }}
                  className="table-row-clickable"
                >
                  {visibleColumns.map((header, colIndex) => {
                    const raw = row[header];
                    if (dateHeaders.has(header)) {
                      const d = parseDateString(raw);
                      return (
                        <td key={`td_${rowIndex}_${colIndex}`}>
                          {d ? formatEuropean(d) : raw}
                        </td>
                      );
                    }
                    return <td key={`td_${rowIndex}_${colIndex}`}>{raw}</td>;
                  })}
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

      <RowDetailsModal
        isOpen={isModalOpen}
        row={selectedRow}
        headers={headers}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default DataTable;
