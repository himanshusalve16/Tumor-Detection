import React from 'react';

const BrainIcon = () => (
  <svg className="w-16 h-16 text-cyan-400 animate-float" viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 10c-15 0-25 10-25 25 0 5 2 10 5 15-3 5-5 10-5 15 0 15 10 25 25 25s25-10 25-25c0-5-2-10-5-15 3-5 5-10 5-15 0-15-10-25-25-25z"/>
    <circle cx="40" cy="35" r="3" fill="white" opacity="0.8"/>
    <circle cx="60" cy="35" r="3" fill="white" opacity="0.8"/>
    <path d="M45 55c0 3 2 5 5 5s5-2 5-5" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

const NeuronIcon = () => (
  <svg className="w-12 h-12 text-pink-400 animate-pulse-slow" viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="8"/>
    <path d="M20 30c0 0 20-10 30 0s30 0 30 0" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M20 70c0 0 20 10 30 0s30 0 30 0" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M30 20c0 0 10-20 20 0s20 0 20 0" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M30 80c0 0 10 20 20 0s20 0 20 0" stroke="currentColor" strokeWidth="3" fill="none"/>
  </svg>
);

const MRIIcon = () => (
  <svg className="w-14 h-14 text-green-400 animate-bounce-slow" viewBox="0 0 100 100" fill="currentColor">
    <rect x="20" y="20" width="60" height="60" rx="5" fill="none" stroke="currentColor" strokeWidth="3"/>
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="8" fill="currentColor"/>
    <path d="M35 35l30 30M65 35l-30 30" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const Header = () => {
  return (
    <header className="text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 animate-float">
          <BrainIcon />
        </div>
        <div className="absolute top-20 right-20 animate-pulse-slow">
          <NeuronIcon />
        </div>
        <div className="absolute bottom-10 left-1/4 animate-bounce-slow">
          <MRIIcon />
        </div>
        <div className="absolute top-1/2 right-10 animate-float" style={{animationDelay: '2s'}}>
          <BrainIcon />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-pulse-slow" style={{animationDelay: '1s'}}>
          <NeuronIcon />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="inline-flex items-center space-x-4 mb-6">
          <span className="text-6xl animate-bounce-slow">🧠</span>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                        bg-clip-text text-transparent drop-shadow-2xl">
            Brain Tumor Detection
          </h1>
          <span className="text-6xl animate-bounce-slow" style={{animationDelay: '0.5s'}}>🧬</span>
        </div>
        
        <div className="mb-4">
          <span className="text-4xl animate-pulse-slow">💉</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
          Advanced AI-Powered MRI Analysis for Early Brain Tumor Detection
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-lg">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-2xl">🔬</span>
            <span>Medical AI</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-2xl">⚡</span>
            <span>Real-time Analysis</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-2xl">🎯</span>
            <span>High Accuracy</span>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
