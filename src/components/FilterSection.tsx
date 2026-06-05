import React from "react";
import { SearchParameter } from "../types";
import { POSIBLE_CATEGORIES } from "../constants";

interface FilterSectionProps {
  headers: string[];
  selectedColumns: string[];
  availableOrgans: string[];
  selectedOrgans: string[];
  selectedCategories: string[];
  availableNazwaZamierzenia: string[];
  selectedNazwaZamierzenia: string[];
  searchParameters: SearchParameter[];
  onColumnToggle: (column: string) => void;
  onCheckAllColumns: () => void;
  onCheckDefaultColumns: () => void;
  onOrganChange: (organs: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onNazwaZamierzeniaChange: (nazwa: string[]) => void;
  onSearchParametersChange: (params: SearchParameter[]) => void;
  onDateRangeChange?: (from: string | null, to: string | null) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  headers,
  selectedColumns,
  availableOrgans,
  selectedOrgans,
  selectedCategories,
  availableNazwaZamierzenia,
  selectedNazwaZamierzenia,
  searchParameters,
  onColumnToggle,
  onCheckAllColumns,
  onCheckDefaultColumns,
  onOrganChange,
  onCategoryChange,
  onNazwaZamierzeniaChange,
  onSearchParametersChange,
  onDateRangeChange,
}) => {
  const [newParamKey, setNewParamKey] = React.useState(headers[0] || "");
  const [newParamValue, setNewParamValue] = React.useState("");
  // default dateFrom = 3 months ago, dateTo = today
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const yyyyFrom = threeMonthsAgo.getFullYear();
  const mmFrom = String(threeMonthsAgo.getMonth() + 1).padStart(2, "0");
  const ddFrom = String(threeMonthsAgo.getDate()).padStart(2, "0");
  const threeMonthsAgoStr = `${yyyyFrom}-${mmFrom}-${ddFrom}`;

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [dateFrom, setDateFrom] = React.useState<string | null>(
    threeMonthsAgoStr
  );
  const [dateTo, setDateTo] = React.useState<string | null>(todayStr);

  const handleAddSearchParameter = () => {
    if (newParamValue.trim()) {
      onSearchParametersChange([
        ...searchParameters,
        { [newParamKey]: newParamValue },
      ]);
      setNewParamValue("");
    }
  };

  const handleRemoveSearchParameter = (index: number) => {
    onSearchParametersChange(searchParameters.filter((_, i) => i !== index));
  };

  const handleOrganToggle = (organ: string) => {
    const newOrgans = selectedOrgans.includes(organ)
      ? selectedOrgans.filter((o) => o !== organ)
      : [...selectedOrgans, organ];
    onOrganChange(newOrgans);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handleNazwaToggle = (nazwa: string) => {
    const newNazwy = selectedNazwaZamierzenia.includes(nazwa)
      ? selectedNazwaZamierzenia.filter((n) => n !== nazwa)
      : [...selectedNazwaZamierzenia, nazwa];
    onNazwaZamierzeniaChange(newNazwy);
  };

  const handleCheckAllOrgans = () => {
    onOrganChange(availableOrgans);
  };

  const handleClearAllOrgans = () => {
    onOrganChange([]);
  };

  const handleCheckAllCategories = () => {
    onCategoryChange(POSIBLE_CATEGORIES);
  };

  const handleClearAllCategories = () => {
    onCategoryChange([]);
  };

  const handleCheckAllNazwa = () => {
    onNazwaZamierzeniaChange(availableNazwaZamierzenia);
  };

  const handleClearAllNazwa = () => {
    onNazwaZamierzeniaChange([]);
  };

  const handleClearAllColumns = () => {
    onColumnToggle("");
  };

  React.useEffect(() => {
    if (onDateRangeChange) onDateRangeChange(dateFrom, dateTo);
  }, [dateFrom, dateTo, onDateRangeChange]);

  const formatEuropean = (iso: string | null): string => {
    if (!iso) return "";
    // expect ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, d] = iso.split("-");
      return `${d}.${m}.${y}`;
    }
    return iso;
  };

  return (
    <div className="filter-section">
      <h3>
        Kolumny do wyświetlenia:
        <button
          onClick={onCheckAllColumns}
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={() => onColumnToggle("CLEAR_ALL")}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
        <button
          onClick={onCheckDefaultColumns}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Domyślne
        </button>
      </h3>
      <div className="checkbox-grid">
        {headers.map((header, index) => (
          <div key={`col_${index}`} className="checkbox-item-inline">
            <input
              type="checkbox"
              id={`col_${index}`}
              checked={selectedColumns.includes(header)}
              onChange={() => onColumnToggle(header)}
            />
            <label htmlFor={`col_${index}`}>{header}</label>
          </div>
        ))}
      </div>

      <h3>
        Organy administracyjne:
        <button
          onClick={handleCheckAllOrgans}
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={handleClearAllOrgans}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
      </h3>
      <div className="checkbox-grid">
        {availableOrgans.map((organ) => (
          <div key={organ} className="checkbox-item-inline">
            <input
              type="checkbox"
              id={`organ_${organ}`}
              checked={selectedOrgans.includes(organ)}
              onChange={() => handleOrganToggle(organ)}
            />
            <label htmlFor={`organ_${organ}`}>{organ}</label>
          </div>
        ))}
      </div>

      <h3>
        Kategorie:
        <button
          onClick={handleCheckAllCategories}
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={handleClearAllCategories}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
      </h3>
      <div className="checkbox-grid">
        {POSIBLE_CATEGORIES.map((category) => (
          <div key={category} className="checkbox-item-inline">
            <input
              type="checkbox"
              id={`cat_${category}`}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
            />
            <label htmlFor={`cat_${category}`}>{category}</label>
          </div>
        ))}
      </div>

      <h3>
        Nazwa zamierzenia budowlanego:
        <button
          onClick={handleCheckAllNazwa}
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Zaznacz wszystkie
        </button>
        <button
          onClick={handleClearAllNazwa}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Wyczyść wszystkie
        </button>
      </h3>
      <div className="checkbox-grid">
        {availableNazwaZamierzenia.map((nazwa) => (
          <div key={nazwa} className="checkbox-item-inline">
            <input
              type="checkbox"
              id={`nazwa_${nazwa}`}
              checked={selectedNazwaZamierzenia.includes(nazwa)}
              onChange={() => handleNazwaToggle(nazwa)}
            />
            <label htmlFor={`nazwa_${nazwa}`}>{nazwa}</label>
          </div>
        ))}
      </div>

      <h3>Filtry:</h3>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "8px" }}>Data od:</label>
        <input
          type="date"
          value={dateFrom || ""}
          onChange={(e) => setDateFrom(e.target.value || null)}
          className="form-control"
          style={{
            display: "inline-block",
            width: "180px",
            marginRight: "12px",
          }}
        />
        <span style={{ marginLeft: "8px", color: "#333" }}>
          {formatEuropean(dateFrom)}
        </span>
        <label style={{ marginRight: "8px", marginLeft: "16px" }}>
          Data do:
        </label>
        <input
          type="date"
          value={dateTo || ""}
          onChange={(e) => setDateTo(e.target.value || null)}
          className="form-control"
          style={{ display: "inline-block", width: "180px" }}
        />
        <span style={{ marginLeft: "8px", color: "#333" }}>
          {formatEuropean(dateTo)}
        </span>
      </div>
      <div className="search-parameters">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Kolumna</th>
              <th>Wartość</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {searchParameters.map((param, index) => {
              const key = Object.keys(param)[0];
              const value = param[key];
              return (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{value}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveSearchParameter(index)}
                    >
                      Usuń filtr
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <select
                  value={newParamKey}
                  onChange={(e) => setNewParamKey(e.target.value)}
                  className="form-control"
                >
                  {headers.map((header, index) => (
                    <option key={`opt_${index}`} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={newParamValue}
                  onChange={(e) => setNewParamValue(e.target.value)}
                  placeholder="Wartość filtru..."
                  className="form-control"
                />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddSearchParameter}
                >
                  Dodaj filtr
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilterSection;
