import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

function FileUpload({ onAnalyze }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  // Validate and select PDF
  const handleFile = (selectedFile) => {
    setError("");
    setSuccess("");

    if (!selectedFile) return;

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setFile(null);
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setFile(null);
      setError("File size must be less than 10 MB.");
      return;
    }

    if (selectedFile.size === 0) {
      setFile(null);
      setError("This PDF file is empty.");
      return;
    }

    setFile(selectedFile);
  };

  // Browse files
  const handleBrowse = () => {
    inputRef.current?.click();
  };

  // Handle input selection
  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    handleFile(selectedFile);

    // Allow selecting the same file again
    event.target.value = "";
  };

  // Drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  // Remove selected file
  const handleRemove = () => {
    setFile(null);
    setError("");
    setSuccess("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await onAnalyze(file);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      {/* Heading */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand"></span>
          <p className="text-xs font-bold uppercase tracking-[2px] text-brand">
            Start your analysis
          </p>
        </div>

        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-ink">
          Upload your offer letter
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Upload your offer letter and discover what your salary actually looks
          like after deductions.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex min-h-[235px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
            isDragging
              ? "border-brand bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-brand hover:bg-orange-50/40"
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-brand">
            <UploadCloud size={27} />
          </div>

          <h3 className="text-base font-bold text-ink">
            Drag and drop your PDF here
          </h3>

          <p className="mt-2 text-sm text-muted">
            or browse files from your device
          </p>

          <button
            type="button"
            onClick={handleBrowse}
            className="mt-5 rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Browse PDF
          </button>

          <p className="mt-4 text-xs text-muted">
            PDF only · Maximum file size 10 MB
          </p>
        </div>
      ) : (
        /* Selected file preview */
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FileText size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{file.name}</p>
              <p className="mt-1 text-xs text-muted">
                {formatSize(file.size)} · PDF document
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove selected file"
              className="rounded-lg p-2 text-muted transition hover:bg-red-100 hover:text-red-600"
            >
              <X size={19} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-green-200 pt-3 text-xs font-semibold text-green-700">
            <CheckCircle2 size={15} />
            PDF selected and validated
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Analyze button */}
      <button
        type="button"
        disabled={!file || isLoading}
        onClick={handleAnalyze}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Validating PDF...
          </>
        ) : (
          <>
            Analyze My Offer
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Your document will be processed securely. We won't store your offer
        letter.
      </p>
    </div>
  );
}

export default FileUpload;
