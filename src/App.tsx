import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { DataRow } from "./types";
import {
  parseCSV,
  sortDataByDate,
  getYearFromItem,
  getStateFromItem,
} from "./utils";
import { CHECKBOXES_YEARS, POSIBLE_ORGANS } from "./constants";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingOverlay from "./components/LoadingOverlay";
import UploadPage from "./pages/UploadPage";
import DataPage from "./pages/DataPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [headersFromFile, setHeadersFromFile] = useState<string[]>([]);
  const [dataFromFile, setDataFromFile] = useState<DataRow[]>([]);
  const [rawData, setRawData] = useState<DataRow[]>([]); // Store unfiltered data
  const [selectedYears, setSelectedYears] = useState<string[]>([
    new Date().getFullYear().toString(),
  ]);
  const [selectedStates, setSelectedStates] = useState<string[]>([
    "mazowieckie",
  ]);

  // Function to filter data based on selected years and states
  const filterData = (data: DataRow[], headers: string[]) => {
    console.log("=== FILTERING DATA ===");
    console.log("Total rows:", data.length);

    const rejectedRows: { index: number; reason: string; data: DataRow }[] = [];

    const filteredData = data.filter((item, index) => {
      const year = getYearFromItem(item, headers);
      const state = getStateFromItem(item, headers);

      if (!year || !state) {
        rejectedRows.push({
          index: index + 2,
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

    return sortDataByDate(filteredData, headers);
  };

  // Re-filter data when filters change
  useEffect(() => {
    if (rawData.length > 0 && headersFromFile.length > 0) {
      setLoading(true);
      // Use setTimeout to allow loading overlay to render
      setTimeout(() => {
        const filtered = filterData(rawData, headersFromFile);
        setDataFromFile(filtered);
        setLoading(false);
      }, 100);
    }
  }, [selectedYears, selectedStates]);

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

      console.log("=== CSV PARSED ===");
      console.log("Total rows parsed:", data.length);
      console.log("CSV total lines:", csvData.split("\n").length - 1);

      setRawData(data);
      setHeadersFromFile(headers);

      const filteredData = filterData(data, headers);
      setDataFromFile(filteredData);

      setLoading(false);
      navigate("/data");
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

  const handleClearAllYears = () => {
    setSelectedYears([]);
  };

  const handleCheckAllStates = () => {
    setSelectedStates(Object.keys(POSIBLE_ORGANS));
  };

  const handleClearAllStates = () => {
    setSelectedStates([]);
  };

  const handleHomeClick = () => {
    setHeadersFromFile([]);
    setDataFromFile([]);
    setRawData([]);
    setSelectedYears([new Date().getFullYear().toString()]);
    setSelectedStates(["mazowieckie"]);
    navigate("/");
  };

  return (
    <>
      <Navbar hasData={dataFromFile.length > 0} onHomeClick={handleHomeClick} />
      <div className="App">
        {loading && <LoadingOverlay message="Przetwarzanie pliku CSV..." />}
        <Routes>
          <Route
            path="/"
            element={
              <UploadPage
                loading={loading}
                selectedYears={selectedYears}
                selectedStates={selectedStates}
                onYearChange={handleYearChange}
                onStateChange={handleStateChange}
                onCheckAllYears={handleCheckAllYears}
                onClearAllYears={handleClearAllYears}
                onCheckAllStates={handleCheckAllStates}
                onClearAllStates={handleClearAllStates}
                onFileUpload={handleFileUpload}
              />
            }
          />
          <Route
            path="/data"
            element={<DataPage headers={headersFromFile} data={dataFromFile} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
