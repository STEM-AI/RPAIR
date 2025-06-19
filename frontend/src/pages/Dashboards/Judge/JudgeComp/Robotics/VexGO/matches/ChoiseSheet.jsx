


import { useState } from "react";

export default function ChoiseSheet({ onChallengeSelect }) { 
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const handleChallengeChange = (type) => {
    if (selectedChallenge !== null) return;
    setSelectedChallenge(type);
    onChallengeSelect(type); 
  };
  
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 ">
          <button
            onClick={() => handleChallengeChange('Ocean')}
            className={`relative overflow-hidden px-8 py-6  rounded-xl flex items-center justify-center 
              transition-all duration-300 group ${
                selectedChallenge === 'Ocean'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white scale-105 shadow-lg'
                  : ' bg-white text-gray-600 hover:shadow-md'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="text-4xl mr-3">🌊</span>
            <div className="text-left">
              <h3 className="text-xl font-bold">Ocean Challenge</h3>
              <p className="text-sm opacity-80 mt-1">Marine Exploration Tasks</p>
            </div>
          </button>
  
          <button
            onClick={() => handleChallengeChange('Space')}
            className={`relative overflow-hidden px-8 py-6 rounded-xl flex items-center justify-center 
              transition-all duration-300 group ${
                selectedChallenge === 'Space'
                  ? 'bg-gradient-to-br from-gray-800 to-slate-700 text-white scale-105 shadow-lg'
                  : ' bg-white text-gray-600 hover:shadow-md'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="text-4xl mr-3">🚀</span>
            <div className="text-left">
              <h3 className="text-xl font-bold">Space Challenge</h3>
              <p className="text-sm opacity-80 mt-1">Astro Engineering Tasks</p>
            </div>
          </button>
        </div>
      </>
    );
  }