

import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import {formatTime} from "./constants";
export default function MissionTable({ 
  currentMode, 
  currentModeData, 
  isRunning, 
  completedModes, 
  handleModeComplete,
  handleMissionComplete,
  getTimeDifference,
  currentGame // Added prop to access current game data
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("access_token");

  if (!currentMode) return null;
  
  
  

  const handleCompleteWithScore = async () => {
    if (!currentGame?.gameId) {
      Swal.fire({
        icon: 'error',
        title: 'Game Session Error',
        text: 'No active game session found',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate total score and time from missions
      const totalScore = currentMode.missions.reduce((sum, mission, index) => {
        return sum + (currentModeData?.done[index] ? mission.points : 0);
      }, 0);
      
        const totalTime = currentMode.missions.reduce((sum, mission, index) => {
        return sum + (currentModeData?.done[index] ? getTimeDifference(index) : 0);
      }, 0);

      // Send PATCH request to update game scores
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/vex-123/game/${currentGame.gameId}/`,
        {
          score: totalScore,
          time_taken: totalTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Verify the response
      if (response.data?.id) {
        // Call the original completion handler
        handleModeComplete();
        
        Swal.fire({
          icon: 'success',
          title: 'Score Submitted',
          text: `Successfully submitted ${totalScore} points`,
          confirmButtonColor: '#6366f1'
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Score submission error:", error);
      console.log("Error Response:", error.response.data);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Could not submit scores',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  {formatTime(getTimeDifference(index))}
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
          onClick={handleCompleteWithScore}
          disabled={!isRunning || completedModes.includes(currentMode.name) || isSubmitting}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center ${
            !isRunning || completedModes.includes(currentMode.name)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          } ${isSubmitting ? "opacity-75" : ""}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            completedModes.includes(currentMode.name) ? "Completed" : "Mark Complete"
          )}
        </button>
      </div>
    </div>
  );
}