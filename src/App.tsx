import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { DataRow } from "./types";
import {
  parseCSV,
  parseCSVHeadersAndSeparator,
  parseCSVBatch,
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

const CHUNK_SIZE = 2000;

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedRows, setLoadedRows] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const chunkTokenRef = useRef(0);
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

    // Cancel any in-progress chunk processing
    chunkTokenRef.current += 1;
    const myToken = chunkTokenRef.current;

    setLoading(true);
    setLoadingMore(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const lines = csvData.split("\n");

      if (lines.length < 2) {
        setLoading(false);
        return;
      }

      const { headers, separator } = parseCSVHeadersAndSeparator(lines[0]);
      const capturedYears = [...selectedYears];
      const capturedStates = [...selectedStates];
      const lineCount = lines.length - 1;

      setHeadersFromFile(headers);
      setRawData([]);
      setDataFromFile([]);
      setTotalRows(lineCount);
      setLoadedRows(0);
      setLoading(false);
      navigate("/data");
      setLoadingMore(true);

      let idx = 1;
      const accRaw: DataRow[] = [];

      const filterBatch = (data: DataRow[]) =>
        data.filter((item) => {
          const year = getYearFromItem(item, headers);
          const state = getStateFromItem(item, headers);
          return (
            year &&
            state &&
            capturedYears.includes(year) &&
            capturedStates.includes(state)
          );
        });

      const processChunk = () => {
        if (chunkTokenRef.current !== myToken) return; // cancelled

        const batch = parseCSVBatch(lines, idx, CHUNK_SIZE, headers, separator);
        idx += CHUNK_SIZE;
        accRaw.push(...batch);

        const isDone = idx >= lines.length;

        if (isDone) {
          const filtered = filterBatch(accRaw);
          const sorted = sortDataByDate(filtered, headers);
          setRawData(accRaw);
          setDataFromFile(sorted);
          setLoadedRows(accRaw.length);
          setLoadingMore(false);
        } else {
          setDataFromFile(filterBatch(accRaw));
          setLoadedRows(accRaw.length);
          setTimeout(processChunk, 0);
        }
      };

      setTimeout(processChunk, 0);
    };

    reader.readAsText(file);
  };

  const handleYearChange = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const handleStateChange = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state],
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
    chunkTokenRef.current += 1; // cancel any in-progress loading
    setHeadersFromFile([]);
    setDataFromFile([]);
    setRawData([]);
    setLoadingMore(false);
    setLoadedRows(0);
    setTotalRows(0);
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
            element={
              <DataPage
                headers={headersFromFile}
                data={dataFromFile}
                loadingMore={loadingMore}
                loadedRows={loadedRows}
                totalRows={totalRows}
              />
            }
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
