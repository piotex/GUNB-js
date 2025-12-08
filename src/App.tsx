import React, { useState } from "react";
import "./App.css";
import { DataRow } from "./types";
import {
  parseCSV,
  sortDataByDate,
  getYearFromItem,
  getStateFromItem,
} from "./utils";
import { CHECKBOXES_YEARS, POSIBLE_ORGANS } from "./constants";
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

    // Validate file type - only CSV files allowed
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      alert("Proszę wybrać plik CSV (.csv)");
      event.target.value = ""; // Reset file input
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const { headers, data } = parseCSV(csvData);

      console.log("=== DIAGNOSTIC INFO ===");
      console.log("Total rows parsed:", data.length);
      console.log("CSV total lines:", csvData.split("\n").length - 1); // -1 for header

      // Diagnostic: track rejected rows
      const rejectedRows: { index: number; reason: string; data: DataRow }[] =
        [];

      // Filter data by selected years and states
      const filteredData = data.filter((item, index) => {
        const year = getYearFromItem(item, headers);
        const state = getStateFromItem(item, headers);

        if (!year || !state) {
          rejectedRows.push({
            index: index + 2, // +2 because: +1 for header, +1 for 0-based index
            reason: `Missing year (${year}) or state (${state})`,
            data: item,
          });
          return false;
        }
        if (!selectedYears.includes(year)) {
          rejectedRows.push({
            index: index + 2,
            reason: `Year ${year} not in selected years`,
            data: item,
          });
          return false;
        }
        if (!selectedStates.includes(state)) {
          rejectedRows.push({
            index: index + 2,
            reason: `State ${state} not in selected states`,
            data: item,
          });
          return false;
        }

        return true;
      });

      console.log("Rows after filtering:", filteredData.length);
      console.log("Rejected rows:", rejectedRows.length);

      if (rejectedRows.length > 0) {
        console.log("First 10 rejected rows:");
        rejectedRows.slice(0, 10).forEach(({ index, reason, data }) => {
          const dateKey = headers.includes("data_wplywu_wniosku_do_urzedu")
            ? "data_wplywu_wniosku_do_urzedu"
            : "data_wplywu_wniosku";
          const stateKey = headers.includes("wojewodztwo_objekt")
            ? "wojewodztwo_objekt"
            : "wojewodztwo";

          console.log(`Row ${index}: ${reason}`);
          console.log(
            `  Date: "${data[dateKey]}" | State: "${data[stateKey]}"`
          );
        });
      }

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
