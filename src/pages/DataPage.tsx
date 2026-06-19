import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataDisplay from "../components/DataDisplay";
import { DataRow } from "../types";

interface DataPageProps {
  headers: string[];
  data: DataRow[];
  loadingMore?: boolean;
  loadedRows?: number;
  totalRows?: number;
}

const DataPage: React.FC<DataPageProps> = ({
  headers,
  data,
  loadingMore,
  loadedRows,
  totalRows,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // If there are no data rows, only redirect to home when not loading more.
    if (data.length === 0 && !loadingMore) {
      navigate("/");
    }
  }, [data, loadingMore, navigate]);

  // While loadingMore is true we still render the page so the progress banner is visible.
  if (data.length === 0 && !loadingMore) {
    return null;
  }

  return (
    <div className="page-container">
      <DataDisplay
        headers={headers}
        data={data}
        loadingMore={loadingMore}
        loadedRows={loadedRows}
        totalRows={totalRows}
      />
    </div>
  );
};

export default DataPage;
