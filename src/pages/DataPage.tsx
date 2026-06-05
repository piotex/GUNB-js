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
    if (data.length === 0) {
      navigate("/");
    }
  }, [data, navigate]);

  if (data.length === 0) {
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
