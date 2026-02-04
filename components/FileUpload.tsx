import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import FileIcon from './icons/FileIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert('Please upload a valid file type (PDF, JPEG, PNG).');
        setFileName(null);
      }
    }
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFile(e.target.files);
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-2xl mx-auto text-center"
    >
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } ${dragActive ? 'border-blue-500 bg-slate-700/50 scale-105' : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50'}`}
        >
            <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpeg,.jpg,.png"
            onChange={handleChange}
            disabled={disabled}
            />
            <div className="flex flex-col items-center justify-center text-slate-400">
                <UploadIcon className="w-16 h-16 mb-4 text-slate-500" />
                <p className="text-lg font-semibold">Drag and drop your file here</p>
                <p className="my-2">or</p>
                <button
                type="button"
                onClick={onButtonClick}
                disabled={disabled}
                className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                >
                Browse File
                </button>
                <p className="mt-4 text-sm text-slate-500">Supports: PDF, JPEG, PNG</p>
            </div>
      </div>
       {fileName && (
        <div className="mt-6 view-fade-in">
            <div className="flex items-center justify-center bg-slate-800/80 border border-slate-700 rounded-lg p-3 max-w-md mx-auto">
                <FileIcon className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                <p className="text-slate-200 font-medium truncate" title={fileName}>{fileName}</p>
            </div>
        </div>
        )}
    </div>
  );
};

export default FileUpload;