import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataRow, SearchParameter } from "../types";
import { POSIBLE_CATEGORIES, DEFAULT_COLUMNS } from "../constants";
import { getNazwaZamierzeniaKey } from "../utils";
import {
  geocodeCity,
  postalByCity,
  loadPostalCSV,
  isCached,
} from "../geocoding";
import FilterSection from "./FilterSection";
import DataTable from "./DataTable";
import MapPanel from "./MapPanel";

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
    // Default filter: nazwa_zam_budowlanego contains 'budynek' or 'budynków' if the header exists
    headers.includes("nazwa_zam_budowlanego")
      ? [{ nazwa_zam_budowlanego: "budynek|budynków" } as SearchParameter]
      : [],
  );
  const [maxElements, setMaxElements] = useState<number>(100);
  const [availableOrgans, setAvailableOrgans] = useState<string[]>([]);
  const [availableNazwaZamierzenia, setAvailableNazwaZamierzenia] = useState<
    string[]
  >([]);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [postalCodeFilter, setPostalCodeFilter] = useState<string>("");
  const [showMap, setShowMap] = useState(false);
  const [postalVersion, setPostalVersion] = useState(0);
  const [isEnriching, setIsEnriching] = useState(false);
  const [showUnique, setShowUnique] = useState<boolean>(false);
  const [showWithoutDecision, setShowWithoutDecision] =
    useState<boolean>(false);
  const enrichCancelRef = useRef(0);
  const postalCsvInputRef = useRef<HTMLInputElement>(null);
  const filteredDataRef = useRef<DataRow[]>([]);

  const cityKey = headers.includes("miasto") ? "miasto" : "";
  const POSTAL_COL = "_kod_pocztowy";

  const voivKey = headers.includes("wojewodztwo") ? "wojewodztwo" : "";

  const enrichedData = useMemo<DataRow[]>(() => {
    return data.map((row) => {
      const city = cityKey ? (row[cityKey] || "").trim() : "";
      const voiv = voivKey ? (row[voivKey] || "").trim() : "";
      const postal = city
        ? ((voiv ? postalByCity.get(`${city}|${voiv}`) : undefined) ??
          postalByCity.get(city) ??
          "")
        : "";
      return { ...row, [POSTAL_COL]: postal };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, cityKey, voivKey, postalVersion]);

  const displayHeaders = useMemo<string[]>(() => {
    if (!cityKey || headers.includes(POSTAL_COL)) return headers;
    return [...headers, POSTAL_COL];
  }, [headers, cityKey]);

  // Auto-select _kod_pocztowy column on first load (if miasto column exists)
  useEffect(() => {
    if (cityKey && !selectedColumns.includes(POSTAL_COL)) {
      setSelectedColumns((prev) => [...prev, POSTAL_COL]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  // Re-select after geocoding fills in values
  useEffect(() => {
    if (postalVersion > 0 && !selectedColumns.includes(POSTAL_COL)) {
      setSelectedColumns((prev) => [...prev, POSTAL_COL]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalVersion]);

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
    const nazwaKey = getNazwaZamierzeniaKey(displayHeaders);
    // choose date key: try data_wplywu_wniosku_do_urzedu then data_wplywu_wniosku then data_wydania_decyzji
    const dateKey = displayHeaders.includes("data_wplywu_wniosku_do_urzedu")
      ? "data_wplywu_wniosku_do_urzedu"
      : displayHeaders.includes("data_wplywu_wniosku")
        ? "data_wplywu_wniosku"
        : displayHeaders.includes("data_wydania_decyzji")
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

    return enrichedData.filter((item) => {
      // Filter by nazwa zamierzenia
      const nazwa = item[nazwaKey]?.replace(/"/g, "").trim();
      if (nazwa && !selectedNazwaZamierzenia.includes(nazwa)) {
        return false;
      }

      // Filter by organs
      const organ = (item["nazwa_organu"] || "").trim();
      if (organ && !selectedOrgans.includes(organ)) {
        return false;
      }

      // Filter by categories
      const category = item["kategoria"];
      if (category && !selectedCategories.includes(category)) {
        return false;
      }

      // Filter by search parameters (| separates OR alternatives)
      for (const param of searchParameters) {
        const key = Object.keys(param)[0];
        const value = param[key];
        const fieldVal = item[key] || "";
        const alternatives = value
          .split("|")
          .map((v) => v.trim())
          .filter(Boolean);
        const anyMatch = alternatives.some((alt) => fieldVal.includes(alt));
        if (!anyMatch) {
          return false;
        }
      }

      // Filter by postal code (search all columns)
      if (postalCodeFilter.trim()) {
        const pc = postalCodeFilter.trim().toLowerCase();
        const matchesAny = Object.values(item).some(
          (v) => v && v.toLowerCase().includes(pc),
        );
        if (!matchesAny) return false;
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
          // If date can't be parsed, skip date filter for this record
          // (don't exclude — missing/malformed dates should still be visible)
        }
      }

      // Filter: only rows without a decision
      if (showWithoutDecision) {
        const decNum = (item["numer_decyzji_urzedu"] || "").trim();
        const decDate = (item["data_wydania_decyzji"] || "").trim();
        if (decNum || decDate) return false;
      }

      return true;
    });
  };

  const filteredData = filterData();
  filteredDataRef.current = filteredData;

  const columnTooltips: Record<string, string> = {
    [POSTAL_COL]:
      "Kolumna obliczana automatycznie — wartość pobierana na podstawie pola „Miasto” z każdego wiersza za pomocą geokodowania (Nominatim / OpenStreetMap). Kliknij „📍 Pobierz kody pocztowe‟, aby ją wypełnić. Możesz też załadować własną listę kodow przez „📂 Importuj kody z CSV‟.",
  };

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
    setSelectedColumns(displayHeaders);
  };

  const handleCheckDefaultColumns = () => {
    setSelectedColumns(
      DEFAULT_COLUMNS.filter((col) => displayHeaders.includes(col)),
    );
  };

  /** Geocode unique cities in the currently-filtered (visible) rows only */
  const handleEnrich = async () => {
    if (!cityKey || isEnriching) return;
    const token = ++enrichCancelRef.current;
    setIsEnriching(true);

    const map = new Map<string, { city: string; voiv: string }>();
    filteredDataRef.current.forEach((r) => {
      const city = (r[cityKey] || "").trim();
      const voiv = (r[voivKey] || "").trim();
      if (!city) return;
      const key = `${city}|${voiv}`;
      if (!map.has(key)) map.set(key, { city, voiv });
    });

    const entries = Array.from(map.values());
    const pending = entries.filter(
      (e) =>
        !postalByCity.has(`${e.city}|${e.voiv}`) && !isCached(e.city, e.voiv),
    );

    for (const e of pending) {
      if (enrichCancelRef.current !== token) break;
      await geocodeCity(e.city, e.voiv); // queue + throttle handled inside geocoding.ts
      setPostalVersion((v) => v + 1);
    }

    setIsEnriching(false);
    setPostalVersion((v) => v + 1);
  };

  /** Import a user-provided postal-code CSV */
  const handlePostalCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const count = loadPostalCSV(text);
      setPostalVersion((v) => v + 1);
      alert(`Wczytano ${count} kod\u00f3w pocztowych.`);
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const handleExportCSV = () => {
    const dataToExport = showUnique ? uniqueFilteredData : filteredData;
    const cols = selectedColumns.length > 0 ? selectedColumns : headers;

    const escapeCell = (val: string): string => {
      const s = (val ?? "").toString();
      if (s.includes(";") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const lines = [
      cols.map(escapeCell).join(";"),
      ...dataToExport.map((row) =>
        cols.map((col) => escapeCell(row[col] || "")).join(";"),
      ),
    ];

    const bom = "\uFEFF";
    const csvContent = bom + lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eksport_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        headers={displayHeaders}
        selectedColumns={selectedColumns}
        columnTooltips={columnTooltips}
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
        onPostalCodeChange={setPostalCodeFilter}
      />

      <h3>Podsumowanie:</h3>
      <div className="summary">
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <button
            className={`btn btn-sm ${showWithoutDecision ? "btn-warning" : ""}`}
            onClick={() => setShowWithoutDecision((s) => !s)}
            style={{
              backgroundColor: showWithoutDecision ? undefined : "#e2e8f0",
              color: "#000",
              borderColor: showWithoutDecision ? undefined : "#94a3b8",
            }}
            title="Pokaż wnioski, które nie mają jeszcze wydanej decyzji (puste numer_decyzji_urzedu i data_wydania_decyzji)"
          >
            {showWithoutDecision
              ? "Pokaż wszystkie (z i bez decyzji)"
              : "Pokaż tylko bez decyzji"}
          </button>
          <button
            className={`btn btn-sm ${showUnique ? "btn-primary" : ""}`}
            onClick={() => setShowUnique((s) => !s)}
            style={{
              backgroundColor: showUnique ? undefined : "#f0ad4e",
              color: showUnique ? undefined : "#000",
              borderColor: showUnique ? undefined : "#d4882b",
            }}
          >
            {showUnique
              ? "Pokaż wszystkie"
              : "Pokaż tylko unikalne (numer_decyzji_urzedu)"}
          </button>
          <button className="btn btn-sm btn-success" onClick={handleExportCSV}>
            ↓ Eksportuj do CSV
          </button>
          <button
            className="btn btn-sm btn-info"
            style={{
              background: "#0ea5e9",
              color: "#fff",
              borderColor: "#0284c7",
            }}
            onClick={() => setShowMap(true)}
          >
            🗺️ Pokaż na mapie
          </button>
          {cityKey && (
            <>
              <button
                className="btn btn-sm"
                style={{
                  background: isEnriching ? "#6b7280" : "#7c3aed",
                  color: "#fff",
                  borderColor: isEnriching ? "#4b5563" : "#5b21b6",
                }}
                onClick={
                  isEnriching
                    ? () => {
                        enrichCancelRef.current++;
                        setIsEnriching(false);
                      }
                    : handleEnrich
                }
                title="Pobiera kody pocztowe z OpenStreetMap (Nominatim) dla widocznych miast. Może nie działać na localhost."
              >
                {isEnriching
                  ? "⏳ Anuluj geocoding"
                  : "📍 Pobierz kody pocztowe"}
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: "#059669",
                  color: "#fff",
                  borderColor: "#047857",
                }}
                onClick={() => postalCsvInputRef.current?.click()}
                title="Importuj plik CSV z kodami pocztowymi: nazwa_miejscowości;XX-XXX"
              >
                📂 Importuj kody pocztowe z CSV
              </button>
              <input
                ref={postalCsvInputRef}
                type="file"
                accept=".csv,.txt"
                style={{ display: "none" }}
                onChange={handlePostalCSV}
              />
            </>
          )}
        </div>
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
        headers={displayHeaders}
        selectedColumns={selectedColumns}
        maxElements={maxElements}
      />
      {showMap && (
        <MapPanel
          data={showUnique ? uniqueFilteredData : filteredData}
          headers={headers}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default DataDisplay;
