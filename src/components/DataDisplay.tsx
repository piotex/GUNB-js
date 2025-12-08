import React, { useState, useEffect } from "react";
import { DataRow, SearchParameter } from "../types";
import { POSIBLE_CATEGORIES, DEFAULT_COLUMNS } from "../constants";
import { getNazwaZamierzeniaKey } from "../utils";
import FilterSection from "./FilterSection";
import DataTable from "./DataTable";

interface DataDisplayProps {
  headers: string[];
  data: DataRow[];
  onReset: () => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  headers,
  data,
  onReset,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    DEFAULT_COLUMNS.filter((col) => headers.includes(col))
  );
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(POSIBLE_CATEGORIES);
  const [selectedNazwaZamierzenia, setSelectedNazwaZamierzenia] = useState<
    string[]
  >([]);
  const [searchParameters, setSearchParameters] = useState<SearchParameter[]>(
    []
  );
  const [maxElements, setMaxElements] = useState<number>(100);
  const [availableOrgans, setAvailableOrgans] = useState<string[]>([]);
  const [availableNazwaZamierzenia, setAvailableNazwaZamierzenia] = useState<
    string[]
  >([]);

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

      return true;
    });
  };

  const filteredData = filterData();

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
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
      <button className="btn btn-danger" onClick={onReset}>
        Powrót
      </button>

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
      />

      <h3>Podsumowanie:</h3>
      <div className="summary">
        Liczba elementów spełniających wszystkie filtry: {filteredData.length}
        <br />
        Liczba elementów spełniających filtry zdefiniowane podczas wczytywania
        pliku: {data.length}
      </div>

      <div style={{ margin: "20px 0" }}>
        <label htmlFor="max-elements">
          Maksymalna liczba wyświetlanych wierszy:{" "}
        </label>
        <input
          id="max-elements"
          type="number"
          value={maxElements}
          onChange={(e) => setMaxElements(parseInt(e.target.value) || 100)}
          style={{ marginLeft: "10px", width: "100px" }}
        />
      </div>

      <h3>Dane:</h3>
      <DataTable
        data={filteredData}
        headers={headers}
        selectedColumns={selectedColumns}
        maxElements={maxElements}
      />
    </div>
  );
};

export default DataDisplay;
