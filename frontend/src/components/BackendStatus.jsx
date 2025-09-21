import React from 'react';

const BackendStatus = ({ status, onRetry }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: '✅',
          message: 'Backend Connected',
          color: 'text-green-800',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          dotColor: 'bg-green-500 animate-pulse'
        };
      case 'disconnected':
        return {
          icon: '❌',
          message: 'Backend Disconnected',
          color: 'text-red-800',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          dotColor: 'bg-red-500'
        };
      case 'checking':
        return {
          icon: '🔄',
          message: 'Checking Connection...',
          color: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          dotColor: 'bg-yellow-500 animate-pulse'
        };
      default:
        return {
          icon: '❓',
          message: 'Unknown Status',
          color: 'text-gray-800',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex justify-center mt-8">
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
        <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></div>
        <span>{statusInfo.message}</span>
        {status === 'disconnected' && onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-xs underline hover:no-underline"
          >
            Retry
          </button>
        )}
      </div>
      
      {/* Backend instructions when disconnected */}
      {status === 'disconnected' && (
        <div className="mt-4 max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Backend Server Not Running</h3>
                <p className="text-red-700 text-sm mb-3">
                  The AI backend server is not connected. Please start the backend server to use the brain tumor detection feature.
                </p>
                <div className="text-red-600 text-xs space-y-1">
                  <p><strong>To start the backend:</strong></p>
                  <div className="bg-red-100 p-2 rounded font-mono text-xs">
                    <p>cd backend</p>
                    <p>python app.py</p>
                  </div>
                  <p className="mt-2">Or run: <code className="bg-red-100 px-1 rounded">python start_full_system.py</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
