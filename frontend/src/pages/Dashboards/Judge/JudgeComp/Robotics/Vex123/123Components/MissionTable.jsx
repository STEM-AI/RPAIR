export default function MissionTable({ 
    currentMode, 
    currentModeData, 
    isRunning, 
    completedModes, 
    handleModeComplete,
    handleMissionComplete,
    getTimeDifference
  }) {
    if (!currentMode) return null;
  
    return (
      <div className="mb-4 sm:mb-6 bg-white p-2 sm:p-3 rounded-lg border border-indigo-100 overflow-x-auto">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-indigo-700 mb-2 sm:mb-3">
          {currentMode.name} Missions
        </h2>
        <div className="min-w-[400px] sm:min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Mission</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Description</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Points</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Time</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Done</th>
              </tr>
            </thead>
            <tbody>
              {currentMode.missions.map((mission, index) => (
                <tr key={index} className="border-b border-indigo-50">
                  <td className="px-2 py-1 sm:px-3 sm:py-2 font-medium text-gray-800 text-xs sm:text-sm">
                    {mission.step}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-xs sm:text-sm">
                    {mission.description}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                    {mission.points}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                    {getTimeDifference(index)}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => handleMissionComplete(index)}
                      checked={!!currentModeData?.done[index] || false}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isRunning || completedModes.includes(currentMode.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 sm:mt-3 flex justify-end">
          <button
            onClick={handleModeComplete}
            disabled={!isRunning || completedModes.includes(currentMode.name)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${
              !isRunning || completedModes.includes(currentMode.name)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {completedModes.includes(currentMode.name) ? "Completed" : "Mark Complete"}
          </button>
        </div>
      </div>
    );
  }