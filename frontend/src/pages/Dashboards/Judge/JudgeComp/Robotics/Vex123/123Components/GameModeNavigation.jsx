export default function GameModeNavigation({ 
    GAME_MODES, 
    handleGameModeSelect, 
    currentMode, 
    completedModes 
  }) {
    return (
      <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
        <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">Game Mode Progress</h2>
        <div className="flex space-x-2 min-w-max">
          {GAME_MODES.map((mode) => (
            <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
              <button
                onClick={() => handleGameModeSelect(mode)}
                className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  completedModes.includes(mode.name)
                    ? "bg-green-600 text-white shadow-md"
                    : currentMode?.name === mode.name
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
                }`}
              >
                {mode.name}
              </button>
              {completedModes.includes(mode.name) && (
                <span className="text-[10px] sm:text-xs mt-1 text-green-600">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }