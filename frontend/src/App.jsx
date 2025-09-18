import React, { useState } from 'react';
import Header from './components/Header';
import Upload from './components/Upload';
import Result from './components/Result';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectionStatus, setDetectionStatus] = useState('No Image Uploaded');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (imageFile) => {
    setUploadedImage(imageFile);
    setDetectionStatus('Image Uploaded');
  };

  const handleDetection = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setDetectionStatus('Processing...');
    
    // Simulate AI processing delay
    setTimeout(() => {
      const hasTumor = Math.random() > 0.5; // Random result for demo
      setDetectionStatus(hasTumor ? 'Tumor Detected' : 'No Tumor Detected');
      setIsProcessing(false);
    }, 3000);
  };

  const resetDetection = () => {
    setUploadedImage(null);
    setDetectionStatus('No Image Uploaded');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <Upload 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
            />
            
            <div className="flex justify-center">
              <button
                onClick={handleDetection}
                disabled={!uploadedImage || isProcessing}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 
                         text-white font-semibold text-lg rounded-xl shadow-lg 
                         transition-all duration-200 hover:shadow-xl hover:from-blue-700 hover:to-indigo-800
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>🧠</span>
                      <span>Detect Tumor</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Result 
              status={detectionStatus}
              isProcessing={isProcessing}
              uploadedImage={uploadedImage}
              onReset={resetDetection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
