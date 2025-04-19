import { FaDownload } from "react-icons/fa";
import { formatTime } from "./constants";


export default function SummarySection({ 
  totalScore, 
  totalPossible, 
  totalTime, 
  handleDownloadPDF, 
  teamName 
}) {
  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Score</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {totalScore} / {totalPossible} points
          </p>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Time</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {formatTime(totalTime)}
          </p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
          disabled={!teamName}
        >
          <FaDownload className="mr-1 sm:mr-2" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}