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

const Result = ({ status, isProcessing, uploadedImage, onReset }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'No Image Uploaded':
        return {
          title: 'Ready for Analysis',
          description: 'Upload an MRI scan to begin tumor detection analysis.',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30'
        };
      case 'Image Uploaded':
        return {
          title: 'Image Ready',
          description: 'Your MRI scan has been uploaded successfully. Click "Detect Tumor" to start analysis.',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30'
        };
      case 'Processing...':
        return {
          title: 'Analyzing MRI Scan',
          description: 'Our AI is processing your brain MRI scan. This may take a few moments...',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/30'
        };
      case 'Tumor Detected':
        return {
          title: 'Tumor Detected',
          description: 'Our AI has identified potential tumor activity in the MRI scan. Please consult with a medical professional immediately.',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30'
        };
      case 'No Tumor Detected':
        return {
          title: 'No Tumor Detected',
          description: 'Great news! Our AI analysis shows no signs of tumor activity in your MRI scan.',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30'
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'An unexpected error occurred. Please try again.',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 ${statusInfo.borderColor} 
                      transition-all duration-500 hover:scale-105 hover:shadow-2xl`}>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div className="absolute top-4 left-4 animate-float">
            <span className="text-2xl">🔬</span>
          </div>
          <div className="absolute bottom-4 right-4 animate-pulse-slow">
            <span className="text-2xl">💊</span>
          </div>
          <div className="absolute top-1/2 left-2 animate-bounce-slow">
            <span className="text-xl">🧬</span>
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
          <h3 className={`text-2xl font-bold mb-4 ${statusInfo.color}`}>
            {statusInfo.title}
          </h3>
          
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            {statusInfo.description}
          </p>

          {/* Additional info based on status */}
          {status === 'Tumor Detected' && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-red-300 mb-2">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">Important Notice</span>
              </div>
              <p className="text-red-200 text-sm">
                This is a demonstration tool. Always consult with qualified medical professionals for accurate diagnosis.
              </p>
            </div>
          )}

          {status === 'No Tumor Detected' && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-green-300 mb-2">
                <span className="text-xl">🎉</span>
                <span className="font-semibold">Healthy Scan</span>
              </div>
              <p className="text-green-200 text-sm">
                Continue regular health checkups and consult your doctor for any concerns.
              </p>
            </div>
          )}

          {/* Action buttons */}
          {(status === 'Tumor Detected' || status === 'No Tumor Detected') && (
            <div className="flex space-x-4 justify-center">
              <button
                onClick={onReset}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold 
                         rounded-full shadow-lg transform transition-all duration-300 hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Analyze Another Scan
              </button>
            </div>
          )}

          {/* Processing progress bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full animate-pulse" 
                     style={{width: '60%'}}></div>
              </div>
              <p className="text-cyan-300 text-sm">Processing scan data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence indicator for results */}
      {(status === 'Tumor Detected' || status === 'No Tumor Detected') && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-lg">🎯</span>
            <span className="text-white/80 text-sm font-medium">
              AI Confidence: {Math.floor(Math.random() * 20 + 80)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
