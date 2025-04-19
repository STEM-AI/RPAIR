import { FaClock, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { formatTime } from "./constants";


export default function TimerControls({ 
  timer, 
  isRunning, 
  setIsRunning, 
  resetTimer, 
  currentMode, 
  completedModes 
}) {
  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-center">
        <div className="flex items-center">
          <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
          <span className={`text-base sm:text-xl font-semibold ${
            timer <= 60 ? 'text-red-600' : 'text-gray-700'
          }`}>
            {formatTime(timer)}
          </span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!completedModes.includes(currentMode?.name)) {
                setIsRunning(!isRunning);
              }
            }}
            disabled={timer === 0 || completedModes.includes(currentMode?.name)}
            className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex items-center justify-center ${
              isRunning
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
            <span className="text-xs sm:text-sm">{isRunning ? "Pause" : "Start"}</span>
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center"
            disabled={!currentMode}
          >
            <FaRedo className="mr-1 sm:mr-2" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}