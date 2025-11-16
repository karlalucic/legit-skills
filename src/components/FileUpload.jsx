import { useState } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { detectLanguage } from '../utils/languageDetector';

function FileUpload({ onFileUpload, isAnalyzing = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptedExtensions = ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.c', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.kts', '.cs'];

  const handleFileRead = (file) => {
    // Validate file size (max 1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert('File is too large. Please upload a file smaller than 1MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;

      // Validate content length
      if (content.length > 50000) {
        alert('File content is too long. Please upload a file with less than 50,000 characters.');
        return;
      }

      const langInfo = detectLanguage(file.name);

      setSelectedFile(file.name);
      setDetectedLanguage(langInfo.displayName);

      onFileUpload(file, content, langInfo.language);
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-4 md:p-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-surfaceRaised bg-surface hover:border-primary/50'
        } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedExtensions.join(',')}
          onChange={handleFileSelect}
          disabled={isAnalyzing}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center gap-4 md:gap-6 cursor-pointer"
        >
          {!selectedFile ? (
            <>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surfaceRaised flex items-center justify-center">
                <Upload className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>

              <div className="text-center space-y-2">
                <p className="text-textPrimary text-base md:text-lg font-medium">
                  Drag & drop your code file here
                </p>
                <p className="text-textSecondary text-xs md:text-sm">
                  or click to browse
                </p>
              </div>

              <div className="text-textSecondary text-xs text-center">
                Supported: {acceptedExtensions.slice(0, 5).join(', ')} and more
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>

              <div className="text-center space-y-3">
                <div className="flex items-center gap-2 justify-center text-textPrimary">
                  <File className="w-5 h-5" />
                  <span className="font-medium">{selectedFile}</span>
                </div>

                {detectedLanguage && (
                  <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                    <span className="text-accent text-sm font-medium">
                      {detectedLanguage}
                    </span>
                  </div>
                )}

                <p className="text-textSecondary text-sm">
                  Click to upload a different file
                </p>
              </div>
            </>
          )}
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setSelectedFile(null);
              setDetectedLanguage(null);
            }}
            className="text-textSecondary hover:text-textPrimary text-sm underline transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
