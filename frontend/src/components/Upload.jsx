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
        className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-dashed transition-all duration-300 
                   ${isDragOver 
                     ? 'border-cyan-400 bg-cyan-400/20 scale-105' 
                     : 'border-white/30 hover:border-cyan-400/50 hover:bg-white/15'
                   }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div className="absolute top-4 right-4 animate-float">
            <span className="text-3xl">🧠</span>
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse-slow">
            <span className="text-2xl">💉</span>
          </div>
          <div className="absolute top-1/2 right-8 animate-bounce-slow">
            <span className="text-xl">🔬</span>
          </div>
        </div>

        {!preview ? (
          <div className="text-center">
            <div className="mb-6">
              <BrainScanIcon />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Upload MRI Scan
            </h3>
            
            <p className="text-white/80 mb-8 text-lg">
              Drag & drop your MRI image here, or click to browse
            </p>
            
            <button
              onClick={handleClick}
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white font-semibold px-8 py-4 rounded-full shadow-xl 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25
                       focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <UploadIcon />
              <span>Choose File</span>
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/70">
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
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Image Preview
            </h3>
            
            <div className="relative mb-6">
              <img
                src={preview}
                alt="MRI Preview"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm font-medium">MRI Scan Ready</span>
                  <span className="text-2xl">🧬</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleClick}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold 
                         rounded-full shadow-lg transform transition-all duration-300 hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Change Image
              </button>
              <button
                onClick={removeImage}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold 
                         rounded-full shadow-lg transform transition-all duration-300 hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-red-300"
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
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <div className={`w-3 h-3 rounded-full ${preview ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-white/80 text-sm font-medium">
            {preview ? 'Image uploaded successfully' : 'No image selected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Upload;
