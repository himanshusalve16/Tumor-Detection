import React, { useState, useRef } from 'react';

const UploadIcon = () => (
  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BrainScanIcon = () => (
  <svg className="w-20 h-20 text-purple-400 animate-pulse-slow" viewBox="0 0 100 100" fill="currentColor">
    <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="3"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/>
    <path d="M30 30l40 40M70 30l-40 40" stroke="currentColor" strokeWidth="2"/>
    <circle cx="35" cy="35" r="3" fill="currentColor"/>
    <circle cx="65" cy="35" r="3" fill="currentColor"/>
    <circle cx="35" cy="65" r="3" fill="currentColor"/>
    <circle cx="65" cy="65" r="3" fill="currentColor"/>
  </svg>
);

const Upload = ({ onImageUpload, uploadedImage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Card */}
      <div 
        className={`relative bg-white rounded-2xl p-8 border-2 border-dashed transition-all duration-200 
                   ${isDragOver 
                     ? 'border-blue-400 bg-blue-50' 
                     : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                   }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-10">
          <div className="absolute top-4 right-4">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="text-xl">💉</span>
          </div>
        </div>

        {!preview ? (
          <div className="text-center">
            <div className="mb-6">
              <BrainScanIcon />
            </div>
            
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Upload MRI Scan
            </h3>
            
            <p className="text-slate-600 mb-8 text-lg">
              Drag & drop your MRI image here, or click to browse
            </p>
            
            <button
              onClick={handleClick}
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 
                       text-white font-medium px-8 py-3 rounded-lg shadow-sm 
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <UploadIcon />
              <span>Choose File</span>
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <span>📁</span>
                <span>JPG, PNG, DICOM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📏</span>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <ImageIcon />
            </div>
            
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Image Preview
            </h3>
            
            <div className="relative mb-6">
              <img
                src={preview}
                alt="MRI Preview"
                className="w-full max-w-md mx-auto rounded-xl shadow-lg border border-slate-200"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white bg-black/50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">MRI Scan Ready</span>
                  <span className="text-lg">🧬</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleClick}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium 
                         rounded-lg shadow-sm transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Change Image
              </button>
              <button
                onClick={removeImage}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium 
                         rounded-lg shadow-sm transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Status indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2">
          <div className={`w-3 h-3 rounded-full ${preview ? 'bg-green-500' : 'bg-slate-400'}`}></div>
          <span className="text-slate-600 text-sm font-medium">
            {preview ? 'Image uploaded successfully' : 'No image selected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Upload;
