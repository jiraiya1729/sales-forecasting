"use client";

import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, ArrowUpCircle } from 'lucide-react';

interface UploadComponentProps {
  onUploadSuccess: (data: any) => void;
}

export default function DarkUploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setStatus("loading");

    try {
      const response = await fetch("http://localhost:8000/upload-csv/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data)
        onUploadSuccess(data);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("error");
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: <Check className="w-12 h-12 text-emerald-400" />,
          borderColor: "border-emerald-600",
          message: "Upload successful!",
          bgColor: "bg-emerald-950/50"
        };
      case "error":
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-400" />,
          borderColor: "border-red-800",
          message: "Upload failed",
          bgColor: "bg-red-950/50"
        };
      default:
        return {
          icon: <ArrowUpCircle className="w-12 h-12 text-emerald-400" />,
          borderColor: isDragging ? "border-emerald-600" : "border-gray-700",
          message: file ? file.name : "Drag & drop your CSV file here",
          bgColor: isDragging ? "bg-emerald-950/30" : "bg-gray-900"
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg shadow-black/20 p-8 transition-all duration-500 
                    hover:shadow-xl hover:shadow-black/30 border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8
            flex flex-col items-center justify-center
            transition-all duration-500 ease-in-out
            ${statusConfig.borderColor}
            ${statusConfig.bgColor}
            transform hover:scale-[1.01]
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-950/30 
                         opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer transition-all duration-300 hover:scale-110 relative"
          >
            <div className="transform transition-transform duration-300 hover:rotate-12">
              {statusConfig.icon}
            </div>
          </label>
          
          <div className="mt-4 text-center space-y-2">
            <p className="text-gray-300 font-medium relative overflow-hidden group">
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">
                {statusConfig.message}
              </span>
              <span className="absolute left-0 top-0 translate-y-[100%] group-hover:translate-y-0 
                             transition-transform duration-300">
                {file ? "Change file" : "Select a file"}
              </span>
            </p>
            
            {status === "idle" && !file && (
              <p className="text-gray-500 text-sm animate-pulse">
                or click to browse files
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || status === "loading"}
          className={`
            w-full py-3 px-4 rounded-lg font-medium
            transition-all duration-300
            flex items-center justify-center gap-2
            relative overflow-hidden
            ${!file || status === "loading"
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-600'}
            text-white disabled:opacity-50
            transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-emerald-900/30
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          {status === "loading" ? (
            <>
              <FileText className="animate-spin h-5 w-5" />
              <span className="relative">
                <span className="inline-block animate-pulse">Processing...</span>
              </span>
            </>
          ) : (
            <div className="relative flex items-center gap-2 overflow-hidden h-6">
              <Upload className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <div className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">
                  Upload File
                </span>
                <span className="absolute left-0 top-[100%] transition-transform duration-300 
                               group-hover:translate-y-[-100%]">
                  Let's Go!
                </span>
              </div>
            </div>
          )}
        </button>
      </form>

      {status === "error" && (
        <div className="mt-4 p-4 bg-red-950/30 rounded-lg transform hover:scale-[1.02] 
                       transition-transform duration-300 border border-red-900/50">
          <p className="text-red-400 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
            <span className="relative overflow-hidden group">
              <span className="inline-block group-hover:translate-y-[-100%] transition-transform duration-300">
                An error occurred while uploading the file.
              </span>
              <span className="absolute left-0 translate-y-[100%] group-hover:translate-y-0 
                             transition-transform duration-300">
                Please try again.
              </span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}