import React, { useState, useEffect } from "react";
import { DataRow, SearchParameter } from "../types";
import { POSIBLE_CATEGORIES, DEFAULT_COLUMNS } from "../constants";
import { getNazwaZamierzeniaKey } from "../utils";
import FilterSection from "./FilterSection";
import DataTable from "./DataTable";

interface DataDisplayProps {
  headers: string[];
  data: DataRow[];
  loadingMore?: boolean;
  loadedRows?: number;
  totalRows?: number;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  headers,
  data,
  loadingMore,
  loadedRows,
  totalRows,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    DEFAULT_COLUMNS.filter((col) => headers.includes(col)),
  );
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(POSIBLE_CATEGORIES);
  const [selectedNazwaZamierzenia, setSelectedNazwaZamierzenia] = useState<
    string[]
  >([]);
  const [searchParameters, setSearchParameters] = useState<SearchParameter[]>(
    // Default filter: nazwa_zam_budowlanego = 'budynków' if the header exists
    headers.includes("nazwa_zam_budowlanego")
      ? [{ nazwa_zam_budowlanego: "budynków" } as SearchParameter]
      : [],
  );
  const [maxElements, setMaxElements] = useState<number>(100);
  const [availableOrgans, setAvailableOrgans] = useState<string[]>([]);
  const [availableNazwaZamierzenia, setAvailableNazwaZamierzenia] = useState<
    string[]
  >([]);
  const [dateFrom, setDateFrom] = useState<string | null>("2020-01-01");
  const [dateTo, setDateTo] = useState<string | null>("2023-12-31");

  useEffect(() => {
    // Get available organs based on data
    const organs = new Set<string>();
    data.forEach((item) => {
      const organ = item["nazwa_organu"];
      if (organ && organ.trim()) {
        organs.add(organ.trim());
      }
    });
    const organsList = Array.from(organs).sort();
    setAvailableOrgans(organsList);
    setSelectedOrgans(organsList); // Select all by default

    // Get available nazwa zamierzenia
    const nazwaKey = getNazwaZamierzeniaKey(headers);
    const nazwy = new Set<string>();
    data.forEach((item) => {
      const nazwa = item[nazwaKey];
      if (nazwa && nazwa.trim()) {
        nazwy.add(nazwa.replace(/"/g, "").trim());
      }
    });
    const nazwyList = Array.from(nazwy).sort();
    setAvailableNazwaZamierzenia(nazwyList);
    setSelectedNazwaZamierzenia(nazwyList); // Select all by default
  }, [data, headers]);

  const filterData = (): DataRow[] => {
    const nazwaKey = getNazwaZamierzeniaKey(headers);
    // choose date key: try data_wplywu_wniosku_do_urzedu then data_wplywu_wniosku then data_wydania_decyzji
    const dateKey = headers.includes("data_wplywu_wniosku_do_urzedu")
      ? "data_wplywu_wniosku_do_urzedu"
      : headers.includes("data_wplywu_wniosku")
        ? "data_wplywu_wniosku"
        : headers.includes("data_wydania_decyzji")
          ? "data_wydania_decyzji"
          : null;

    const parseDateString = (s: string | undefined | null): Date | null => {
      if (!s) return null;
      const t = s.toString().trim();
      if (!t) return null;
      // try ISO-like first (YYYY-MM-DD or with time)
      const iso = t.slice(0, 10);
      // YYYY-MM-DD or YYYY/MM/DD
      if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(iso)) return new Date(iso);
      // DD.MM.YYYY -> convert
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(iso)) {
        const parts = iso.split(".");
        const dd = parts[0];
        const mm = parts[1];
        const yyyy = parts[2];
        return new Date(`${yyyy}-${mm}-${dd}`);
      }
      // fallback: let Date try parsing
      const d = new Date(t);
      return isNaN(d.getTime()) ? null : d;
    };

    return data.filter((item) => {
      // Filter by nazwa zamierzenia
      const nazwa = item[nazwaKey]?.replace(/"/g, "").trim();
      if (nazwa && !selectedNazwaZamierzenia.includes(nazwa)) {
        return false;
      }

      // Filter by organs
      const organ = item["nazwa_organu"];
      if (organ && !selectedOrgans.includes(organ)) {
        return false;
      }

      // Filter by categories
      const category = item["kategoria"];
      if (category && !selectedCategories.includes(category)) {
        return false;
      }

      // Filter by search parameters
      for (const param of searchParameters) {
        const key = Object.keys(param)[0];
        const value = param[key];
        if (!item[key] || !item[key].includes(value)) {
          return false;
        }
      }

      // Filter by date range if applicable
      if (dateKey && (dateFrom || dateTo)) {
        const raw = item[dateKey] || "";
        const itemDate = parseDateString(raw);
        if (itemDate) {
          if (dateFrom) {
            const fromDate = parseDateString(dateFrom) as Date;
            if (fromDate && itemDate < fromDate) return false;
          }
          if (dateTo) {
            const toDate = parseDateString(dateTo) as Date;
            if (toDate && itemDate > toDate) return false;
          }
        } else {
          // If we couldn't parse item date, exclude it to be safe
          return false;
        }
      }

      return true;
    });
  };

  const filteredData = filterData();

  const [showUnique, setShowUnique] = useState<boolean>(false);

  const getUniqueByKey = (rows: DataRow[], key: string) => {
    const seen = new Set<string>();
    const unique: DataRow[] = [];
    for (const r of rows) {
      const val = (r[key] || "").toString();
      if (!seen.has(val)) {
        seen.add(val);
        unique.push(r);
      }
    }
    return unique;
  };

  const uniqueFilteredData = getUniqueByKey(
    filteredData,
    "numer_decyzji_urzedu",
  );

  const handleColumnToggle = (column: string) => {
    if (column === "CLEAR_ALL") {
      setSelectedColumns([]);
      return;
    }
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  };

  const handleCheckAllColumns = () => {
    setSelectedColumns(headers);
  };

  const handleCheckDefaultColumns = () => {
    setSelectedColumns(DEFAULT_COLUMNS.filter((col) => headers.includes(col)));
  };

  return (
    <div className="data-display-container">
      {loadingMore && (
        <div className="loading-more-banner">
          <span className="loading-more-spinner" />
          Wczytywanie danych:{" "}
          <strong>{(loadedRows ?? 0).toLocaleString("pl-PL")}</strong> /{" "}
          <strong>{(totalRows ?? 0).toLocaleString("pl-PL")}</strong> wierszy
          <div className="loading-more-bar">
            <div
              className="loading-more-fill"
              style={{
                width: totalRows
                  ? `${Math.round(((loadedRows ?? 0) / totalRows) * 100)}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      )}
      <FilterSection
        headers={headers}
        selectedColumns={selectedColumns}
        availableOrgans={availableOrgans}
        selectedOrgans={selectedOrgans}
        selectedCategories={selectedCategories}
        availableNazwaZamierzenia={availableNazwaZamierzenia}
        selectedNazwaZamierzenia={selectedNazwaZamierzenia}
        searchParameters={searchParameters}
        onColumnToggle={handleColumnToggle}
        onCheckAllColumns={handleCheckAllColumns}
        onCheckDefaultColumns={handleCheckDefaultColumns}
        onOrganChange={setSelectedOrgans}
        onCategoryChange={setSelectedCategories}
        onNazwaZamierzeniaChange={setSelectedNazwaZamierzenia}
        onSearchParametersChange={setSearchParameters}
        onDateRangeChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
        }}
      />

      <h3>Podsumowanie:</h3>
      <div className="summary">
        <button
          className={`btn btn-sm ${showUnique ? "btn-primary" : ""}`}
          onClick={() => setShowUnique((s) => !s)}
          style={{
            marginBottom: "10px",
            backgroundColor: showUnique ? undefined : "#f0ad4e",
            color: showUnique ? undefined : "#000",
            borderColor: showUnique ? undefined : "#d4882b",
          }}
        >
          {showUnique
            ? "Pokaż wszystkie"
            : "Pokaż tylko unikalne (numer_decyzji_urzedu)"}
        </button>
        <br />
        <strong>Ilość elementów (unikalne):</strong> {uniqueFilteredData.length}
        <br />
        <strong>Liczba elementów spełniających wszystkie filtry:</strong>{" "}
        {filteredData.length}
        <br />
        <strong>
          Liczba elementów spełniających filtry zdefiniowane podczas wczytywania
          pliku:
        </strong>{" "}
        {data.length}
      </div>

      <div className="max-elements-control">
        <label htmlFor="max-elements">
          Maksymalna liczba wyświetlanych wierszy:
        </label>
        <input
          id="max-elements"
          type="number"
          value={maxElements}
          onChange={(e) => setMaxElements(parseInt(e.target.value) || 100)}
          className="form-control"
          min="1"
        />
      </div>

      <h3>Dane:</h3>
      <DataTable
        data={showUnique ? uniqueFilteredData : filteredData}
        headers={headers}
        selectedColumns={selectedColumns}
        maxElements={maxElements}
      />
    </div>
  );
};

export default DataDisplay;
