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
    <header className="text-center relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-16 left-16">
          <BrainIcon />
        </div>
        <div className="absolute top-20 right-20">
          <MRIIcon />
        </div>
        <div className="absolute bottom-16 right-16">
          <NeuronIcon />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="inline-flex items-center space-x-4 mb-6">
          <span className="text-5xl">🧠</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Brain Tumor Detection
          </h1>
          <span className="text-5xl">🧬</span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-medium text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-Powered MRI Analysis for Early Brain Tumor Detection
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-slate-600 text-sm">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span className="text-lg">🔬</span>
            <span>Medical AI</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span className="text-lg">⚡</span>
            <span>Real-time Analysis</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span className="text-lg">🎯</span>
            <span>High Accuracy</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
