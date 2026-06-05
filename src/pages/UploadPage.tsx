import React from "react";
import FileUpload from "../components/FileUpload";

interface UploadPageProps {
  loading: boolean;
  selectedYears: string[];
  selectedStates: string[];
  onYearChange: (year: string) => void;
  onStateChange: (state: string) => void;
  onCheckAllYears: () => void;
  onClearAllYears: () => void;
  onCheckAllStates: () => void;
  onClearAllStates: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadPage: React.FC<UploadPageProps> = (props) => {
  return (
    <div className="page-container">
      <FileUpload {...props} />
    </div>
  );
};

export default UploadPage;
