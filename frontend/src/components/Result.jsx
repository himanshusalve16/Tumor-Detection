import React from 'react';

const StatusIcon = ({ status, isProcessing }) => {
  if (isProcessing) {
    return (
      <div className="relative">
        <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🧠</span>
        </div>
      </div>
    );
  }

  switch (status) {
    case 'No Image Uploaded':
      return (
        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center">
          <span className="text-4xl">📷</span>
        </div>
      );
    case 'Image Uploaded':
      return (
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-4xl">✅</span>
        </div>
      );
    case 'Tumor Detected':
      return (
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-4xl">⚠️</span>
        </div>
      );
    case 'No Tumor Detected':
      return (
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-4xl">✅</span>
        </div>
      );
    default:
      return (
        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center">
          <span className="text-4xl">❓</span>
        </div>
      );
  }
};

const BrainVisualization = ({ status }) => {
  const getBrainColor = () => {
    switch (status) {
      case 'Tumor Detected':
        return 'text-red-400';
      case 'No Tumor Detected':
        return 'text-green-400';
      case 'Processing...':
        return 'text-cyan-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <svg className={`w-full h-full ${getBrainColor()} animate-pulse-slow`} viewBox="0 0 200 200" fill="currentColor">
        {/* Brain outline */}
        <path d="M100 20c-25 0-45 15-45 35 0 10 5 20 10 25-5 10-10 20-10 30 0 25 20 45 45 45s45-20 45-45c0-10-5-20-10-30 5-5 10-15 10-25 0-20-20-35-45-35z"/>
        
        {/* Brain sections */}
        <path d="M100 20c-15 0-25 8-25 20 0 5 2 10 5 15-3 5-5 10-5 15 0 15 10 25 25 25s25-10 25-25c0-5-2-10-5-15 3-5 5-10 5-15 0-12-10-20-25-20z" fill="none" stroke="currentColor" strokeWidth="2"/>
        
        {/* Tumor highlight for detection */}
        {status === 'Tumor Detected' && (
          <circle cx="120" cy="80" r="8" fill="red" opacity="0.8" className="animate-pulse">
            <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite"/>
          </circle>
        )}
        
        {/* Healthy brain indicators */}
        {status === 'No Tumor Detected' && (
          <>
            <circle cx="80" cy="60" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="120" cy="60" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="80" cy="140" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="120" cy="140" r="3" fill="currentColor" opacity="0.6"/>
          </>
        )}
        
        {/* Processing animation */}
        {status === 'Processing...' && (
          <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3">
            <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
          </circle>
        )}
      </svg>
    </div>
  );
};

const Result = ({ status, isProcessing, uploadedImage, onReset, predictionResult, error, backendStatus }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'No Image Uploaded':
        return {
          title: backendStatus === 'connected' ? 'Ready for Analysis' : 'Backend Not Connected',
          description: backendStatus === 'connected' 
            ? 'Upload an MRI scan to begin tumor detection analysis.'
            : 'Please start the backend server to use the brain tumor detection feature.',
          color: backendStatus === 'connected' ? 'text-slate-500' : 'text-red-500',
          bgColor: backendStatus === 'connected' ? 'bg-slate-50' : 'bg-red-50',
          borderColor: backendStatus === 'connected' ? 'border-slate-200' : 'border-red-200'
        };
      case 'Image Uploaded':
        return {
          title: 'Image Ready',
          description: 'Your MRI scan has been uploaded successfully. Click "Detect Tumor" to start analysis.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'Processing...':
        return {
          title: 'Analyzing MRI Scan',
          description: 'Our AI is processing your brain MRI scan. This may take a few moments...',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200'
        };
      case 'Tumor Detected':
        return {
          title: 'Tumor Detected',
          description: 'Our AI has identified potential tumor activity in the MRI scan. Please consult with a medical professional immediately.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'No Tumor Detected':
        return {
          title: 'No Tumor Detected',
          description: 'Great news! Our AI analysis shows no signs of tumor activity in your MRI scan.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'Analysis Failed':
        return {
          title: 'Analysis Failed',
          description: error || 'An error occurred during analysis. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'An unexpected error occurred. Please try again.',
          color: 'text-slate-500',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className={`relative bg-white rounded-2xl p-8 border-2 ${statusInfo.borderColor} 
                      transition-all duration-200 hover:shadow-lg`}>
        
        {/* Subtle background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-10">
          <div className="absolute top-4 left-4">
            <span className="text-xl">🔬</span>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="text-xl">💊</span>
          </div>
        </div>

        {/* Status Icon */}
        <div className="text-center mb-6">
          <StatusIcon status={status} isProcessing={isProcessing} />
        </div>

        {/* Brain Visualization */}
        <div className="mb-8">
          <BrainVisualization status={status} />
        </div>

        {/* Status Content */}
        <div className="text-center">
          <h3 className={`text-2xl font-semibold mb-4 ${statusInfo.color}`}>
            {statusInfo.title}
          </h3>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {statusInfo.description}
          </p>

          {/* Additional info based on status */}
          {status === 'Tumor Detected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-red-700 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="font-semibold">Important Notice</span>
              </div>
              <p className="text-red-600 text-sm">
                This is a demonstration tool. Always consult with qualified medical professionals for accurate diagnosis.
              </p>
            </div>
          )}

          {status === 'No Tumor Detected' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                <span className="text-lg">✅</span>
                <span className="font-semibold">Healthy Scan</span>
              </div>
              <p className="text-green-600 text-sm">
                Continue regular health checkups and consult your doctor for any concerns.
              </p>
            </div>
          )}

          {/* Action buttons */}
          {(status === 'Tumor Detected' || status === 'No Tumor Detected') && (
            <div className="flex space-x-4 justify-center">
              <button
                onClick={onReset}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
                         rounded-lg shadow-sm transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Analyze Another Scan
              </button>
            </div>
          )}

          {/* Processing progress bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" 
                     style={{width: '60%'}}></div>
              </div>
              <p className="text-slate-600 text-sm">Processing scan data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence indicator for results */}
      {(status === 'Tumor Detected' || status === 'No Tumor Detected') && predictionResult && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2">
            <span className="text-lg">🎯</span>
            <span className="text-slate-600 text-sm font-medium">
              AI Confidence: {Math.round((predictionResult.confidence || 0) * 100)}%
            </span>
          </div>
          {predictionResult.threshold && (
            <div className="mt-2 text-xs text-slate-500">
              Threshold: {predictionResult.threshold}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Result;
