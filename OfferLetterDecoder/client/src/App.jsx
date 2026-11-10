import { useState } from "react";

import Home from "./Pages/Home";
import Results from "./Pages/Results";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAnalyze = async (file) => {
    const formData = new FormData();

    // Must match upload.single("offerLetter") in Express
    formData.append("offerLetter", file);

    const response = await fetch(`${API_URL}/api/offers/analyze`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    console.log("API Response:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to analyze your offer letter.");
    }

    if (!result.data || !result.data.salaryAnalysis) {
      throw new Error("The server returned incomplete analysis data.");
    }

    setSelectedFile(file);
    setAnalysisData(result.data);
    setCurrentPage("results");
  };

  const handleBack = () => {
    setCurrentPage("home");
  };

  return (
    <>
      {currentPage === "home" ? (
        <Home onAnalyze={handleAnalyze} />
      ) : (
        <Results
          file={selectedFile}
          analysis={analysisData}
          onBack={handleBack}
        />
      )}
    </>
  );
}

export default App;
