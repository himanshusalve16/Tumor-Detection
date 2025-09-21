import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Upload from './components/Upload';
import Result from './components/Result';
import BackendStatus from './components/BackendStatus';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectionStatus, setDetectionStatus] = useState('No Image Uploaded');
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'

  // Backend API configuration
  const API_BASE_URL = 'http://localhost:5000';

  // Check backend connection status
  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      });
      
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (error) {
      console.log('Backend connection failed:', error.message);
      setBackendStatus('disconnected');
    }
  };

  // Check backend connection on component mount and periodically
  useEffect(() => {
    checkBackendConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (imageFile) => {
    setUploadedImage(imageFile);
    setDetectionStatus('Image Uploaded');
    setError(null);
    setPredictionResult(null);
  };

  const handleDetection = async () => {
    if (!uploadedImage) return;
    
    // Check if backend is connected before processing
    if (backendStatus !== 'connected') {
      setError('Backend is not connected. Please check if the server is running.');
      setDetectionStatus('Analysis Failed');
      return;
    }
    
    setIsProcessing(true);
    setDetectionStatus('Processing...');
    setError(null);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadedImage);
      
      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update state with prediction result
      setPredictionResult(result);
      
      // Update detection status based on prediction
      if (result.prediction === 'Tumor Detected') {
        setDetectionStatus('Tumor Detected');
      } else if (result.prediction === 'No Tumor Detected') {
        setDetectionStatus('No Tumor Detected');
      } else {
        setDetectionStatus('Analysis Complete');
      }
      
    } catch (error) {
      console.error('Error during prediction:', error);
      setError(`Failed to analyze image: ${error.message}`);
      setDetectionStatus('Analysis Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDetection = () => {
    setUploadedImage(null);
    setDetectionStatus('No Image Uploaded');
    setIsProcessing(false);
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Backend Connection Status */}
        <BackendStatus 
          status={backendStatus} 
          onRetry={checkBackendConnection}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <Upload 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
            />
            
            <div className="flex justify-center">
              <button
                onClick={handleDetection}
                disabled={!uploadedImage || isProcessing || backendStatus !== 'connected'}
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
                  ) : backendStatus !== 'connected' ? (
                    <>
                      <span>⚠️</span>
                      <span>Backend Disconnected</span>
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
              predictionResult={predictionResult}
              error={error}
              backendStatus={backendStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
