import React, { useState } from "react";
import "./App.css";
import { DataRow, SearchParameter } from "./types";
import {
  parseCSV,
  sortDataByDate,
  getYearFromItem,
  getStateFromItem,
  getNazwaZamierzeniaKey,
} from "./utils";
import {
  CHECKBOXES_YEARS,
  POSIBLE_ORGANS,
  POSIBLE_CATEGORIES,
  DEFAULT_COLUMNS,
} from "./constants";
import FileUpload from "./components/FileUpload";
import DataDisplay from "./components/DataDisplay";

function App() {
  const [loading, setLoading] = useState(false);
  const [headersFromFile, setHeadersFromFile] = useState<string[]>([]);
  const [dataFromFile, setDataFromFile] = useState<DataRow[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([
    new Date().getFullYear().toString(),
  ]);
  const [selectedStates, setSelectedStates] = useState<string[]>([
    "mazowieckie",
  ]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const { headers, data } = parseCSV(csvData);

      // Filter data by selected years and states
      const filteredData = data.filter((item) => {
        const year = getYearFromItem(item, headers);
        const state = getStateFromItem(item, headers);

        if (!year || !state) return false;
        if (!selectedYears.includes(year)) return false;
        if (!selectedStates.includes(state)) return false;

        return true;
      });

      const sortedData = sortDataByDate(filteredData, headers);

      setHeadersFromFile(headers);
      setDataFromFile(sortedData);
      setFileUploaded(true);
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handleYearChange = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleStateChange = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const handleCheckAllYears = () => {
    setSelectedYears(CHECKBOXES_YEARS);
  };

  const handleCheckAllStates = () => {
    setSelectedStates(Object.keys(POSIBLE_ORGANS));
  };

  return (
    <div className="App">
      {!fileUploaded ? (
        <FileUpload
          loading={loading}
          selectedYears={selectedYears}
          selectedStates={selectedStates}
          onYearChange={handleYearChange}
          onStateChange={handleStateChange}
          onCheckAllYears={handleCheckAllYears}
          onCheckAllStates={handleCheckAllStates}
          onFileUpload={handleFileUpload}
        />
      ) : (
        <DataDisplay
          headers={headersFromFile}
          data={dataFromFile}
          onReset={() => window.location.reload()}
        />
      )}
    </div>
  );
}

export default App;
