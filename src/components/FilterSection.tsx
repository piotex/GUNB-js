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
}) => {
  const [newParamKey, setNewParamKey] = React.useState(headers[0] || "");
  const [newParamValue, setNewParamValue] = React.useState("");

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

  const handleCheckAllCategories = () => {
    onCategoryChange(POSIBLE_CATEGORIES);
  };

  const handleCheckAllNazwa = () => {
    onNazwaZamierzeniaChange(availableNazwaZamierzenia);
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
          onClick={onCheckDefaultColumns}
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Domyślne
        </button>
      </h3>
      <div className="checkbox-grid">
        {headers.map((header) => (
          <div key={header} className="checkbox-item-inline">
            <input
              type="checkbox"
              id={`col_${header}`}
              checked={selectedColumns.includes(header)}
              onChange={() => onColumnToggle(header)}
            />
            <label htmlFor={`col_${header}`}>{header}</label>
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
                  {headers.map((header) => (
                    <option key={header} value={header}>
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
